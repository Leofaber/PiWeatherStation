import yaml
import smtplib
import threading
from pathlib import Path
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

class GoogleMailSender:
    """
    gms = GoogleMailSender()
    gms.send_mail_to("leonardo.baroncelli26@gmail.com", "test", "questo è un test")
    """
    def __init__(self):
        config_file = Path(__file__).parent.absolute().joinpath("configuration/conf.yml")
        with open(config_file, 'r') as yamlfile:
            self.config = yaml.safe_load(yamlfile)
        self.sender_pass = self.config["sender_pass"]
        self.sender_address = self.config["sender_address"]
        print("[GoogleMailSender] sender_address:",self.sender_address)

    def send_mail_to(self, receiver_address, subject, mail_content):
        x = threading.Thread(target=self._send_mail_to, args=(receiver_address, subject, mail_content,))
        x.start()

    def _send_mail_to(self, receiver_address, subject, mail_content):

        #Setup the MIME
        message = MIMEMultipart()
        message['From'] = self.sender_address
        message['To'] = receiver_address
        message['Subject'] = subject

        #The body and the attachments for the mail
        message.attach(MIMEText(mail_content, 'plain'))

        #Create SMTP session for sending the mail
        session = smtplib.SMTP('smtp.gmail.com', 587) #use gmail with port
        session.starttls() #enable security
        session.login(self.sender_address, self.sender_pass) #login with mail_id and password
        text = message.as_string()
        session.sendmail(self.sender_address, receiver_address, text)
        session.quit()
        print(f'[GoogleMailSender] {datetime.today()} Mail Sent')
