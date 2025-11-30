python -m venv env
activate: source env/bin/activate  
Windows: env\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver