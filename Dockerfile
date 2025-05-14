FROM python:3.10

WORKDIR /app

# Solo copiamos primero el requirements.txt para cachear bien
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Ahora sí copiamos todo (excepto el venv que no lo deberías subir)
COPY . .

CMD ["python", "app.py"]
