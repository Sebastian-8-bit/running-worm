from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from cs50 import SQL
from werkzeug.security import check_password_hash, generate_password_hash
from auth_helpers import login_required
from datetime import datetime

# Configure application
app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///running_worm.db")



@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response



@app.route("/")
def index():
    # Create the rank of the game
    players = db.execute("SELECT * , ROW_NUMBER() OVER ( ORDER BY played_time ASC) AS rankNumber FROM rank JOIN users ON rank.user_id = users.id LIMIT 15")
    return render_template("index.html", players=players)


@app.route("/login", methods=["GET", "POST"])
def login():

    session.clear()

    # User visit route via POST
    if request.method == "POST":
        # Check if username is typed
        if not request.form.get("username"):
            return render_template("error.html", code=403, error_message="Must Provide Username", Redirect="/login")
        
        # Check if password is typed
        elif not request.form.get("password"):
            return render_template("error.html", code=403, error_message="Must Provide Password", Redirect="/login")

        # Query database for username
        rows = db.execute("SELECT * FROM users WHERE username = ?", request.form.get("username"))

        # Check if username and password exist and are correct
        if len(rows) != 1 or not check_password_hash(
            rows[0]["hash"], request.form.get("password")
        ):
            return render_template("error.html", code=403, error_message="Invalid Username And/Or Password", Redirect="/login")
        
        session["user_id"] = rows[0]["id"]
        
        return redirect("/")
    
    # User visit route via GET
    else:
        return render_template("login.html")


@app.route("/logout")
def logout():

    # Forget user_id
    session.clear()
    return redirect("/")


@app.route("/register", methods=["GET", "POST"])
def register():

    # User visit vial POST
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        confirmation = request.form.get("confirmation")

        # Check if any of username, password or confirmation is empty
        if not username or not password or not confirmation:
            return render_template("error.html", code=403, error_message="Missing Username Or Password",Redirect="/register")
        
        # Check if user typed in the same password and confirmation
        if password != confirmation:
            return render_template("error.html", code=403, error_message="Passwords Don't Match",Redirect="/register")
        
        # Check if the username is used
        for user in db.execute("SELECT username FROM users"):
            if user["username"] == username:
                return render_template("error.html", code=403, error_message="Username Used",Redirect="/register")
        
        # Add user to database
        db.execute("INSERT INTO users (username, hash) VALUES (?, ?)", username, generate_password_hash(password))

        # Remember which user is logged in
        session["user_id"] = db.execute(
            "SELECT id FROM users WHERE username = ?", username)[0]["id"]
        return redirect("/")

    # User visit via GET
    else:
        return render_template("register.html")


@app.route("/game", methods=["GET", "POST"])
@login_required
def game():
    # User visit route via POST request
    if request.method == "POST":
        # Check if user is logged in
        if session["user_id"]:
            t = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            played_time = request.form.get("played_time")
            comment = request.form.get("comment")

            # Insert the played data into database
            db.execute("INSERT INTO rank (user_id, played_time, time, comment) VALUES (?, ?, ?, ?)",
            session.get("user_id"), played_time, t, comment)
        
        return redirect("/")

    # User visit route via GET request
    else:
        return render_template("game.html")


@app.route("/me")
@login_required
def me():
    # Display the play record of the user
    user = db.execute("SELECT rank.id, played_time, time, comment, username FROM rank JOIN users ON rank.user_id = users.id WHERE user_id = ?", session.get("user_id"))
    players = db.execute("SELECT rank.id , users.username, ROW_NUMBER() OVER ( ORDER BY played_time ASC) AS rankNumber FROM rank JOIN users ON rank.user_id = users.id")
    return render_template("me.html", user=user, players=players)

