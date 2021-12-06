FROM python:3.8-buster

WORKDIR /usr/src/app

RUN apt update
RUN apt -y install texlive pandoc
RUN mkdir -p ~/.local/share/fonts

COPY Latex/Exo-Regular.ttf ./
RUN cp ./Exo-Regular.ttf ~/.local/share/fonts/
RUN tlmgr init-usertree
RUN tlmgr install luaotfload
RUN luaotfload-tool --update

COPY requirements.txt ./
RUN fc-cache -f -v

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD [ "python", "-u", "./main.py" ]