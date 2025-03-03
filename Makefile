PROJECT_NAME = cinema_backend
VENV = venv
PYTHON = $(VENV)/bin/python
PIP = $(VENV)/bin/pip
SQL_FILE = seminar_system.sql
NODE_DIR = frontend

install:
	python3 -m venv $(VENV)
	$(PIP) install --upgrade pip
	$(PIP) install django mysqlclient djangorestframework djangorestframework-simplejwt django-cors-headers pymysql
	npm install --prefix $(NODE_DIR)
	npm install --prefix $(NODE_DIR) react react-router-dom axios express cors multer sequelize mysql2

setup-db:
	@if [ -f "$(SQL_FILE)" ]; then \
		echo "Setting up database..."; \
		mysql -u root -p < $(SQL_FILE); \
	else \
		echo "No SQL file found. Skipping database setup."; \
	fi

run:
	$(PYTHON) manage.py runserver &
	npm start --prefix $(NODE_DIR)

migrate:
	$(PYTHON) manage.py migrate

createsuperuser:
	$(PYTHON) manage.py createsuperuser

clean:
	rm -rf $(VENV) __pycache__ $(NODE_DIR)/node_modules

reset-db:
	$(PYTHON) manage.py flush --no-input