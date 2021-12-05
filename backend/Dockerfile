FROM python:3.8-buster

WORKDIR /usr/src/app

RUN apt install texlive texlive-lang-german texlive-latex-extra

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD [ "python", "-u", "./main.py" ]