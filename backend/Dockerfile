FROM python:3.8-buster

WORKDIR /usr/src/app

RUN apt update
RUN apt -y install texlive pandoc
RUN mkdir -p ~/.local/share/fonts

COPY backend/Latex/Exo-Regular.ttf ./
RUN cp ./Exo-Regular.ttf 

COPY requirements.txt ~/.local/share/fonts/
RUN fc-cache -f -v

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD [ "python", "-u", "./main.py" ]