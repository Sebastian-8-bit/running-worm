# Running Worm
## Video Demo: https://youtu.be/igvZrAiqK4M
## Description:
I use Python with Flask as the web framework, Jinja for templating, and SQL for database operations. JavaScript handles the game’s functionality. I also use Bootstrap to enhance the aesthetics of my webpage.

My project is a single-player web game where you control a yellow ball to evade white balls while collecting yellow stroke balls. player also can see how other players played on the leaderboard.

The project consists of two main parts: game design and web architecture.

### Game design
The game is written in JavaScript within the `sketch.js` file, using `p5.js` library for assistance.

The game is originated from my Scratch project called [Running Worm](https://scratch.mit.edu/projects/873441694/).

Different objects have their specific movement patterns:
- Worm (Light yellow ball): Controlled by the player using the WASD keys.
- Clownfish (White small ball): Continuously chases the worm.
- Shark (White big ball): Moves in a straight line and changes direction when it hits the screen edge, then moves towards the worm’s current position, continuing in a straight line.
- Pufferfish (White middle-sized ball): Moves randomly but charges towards the worm when it gets close.
- Broccoli (Light yellow supercircle stroke): Moves randomly all the time.

The player wins by eating a certain number of broccoli with the worm. If the worm is caught by the clownfish, shark, or pufferfish before reaching this number, the player loses.

![Game](/README_IMG/Game.png)

#### sketch.js
Notice that `setup()`, `draw()`, `keyPressed()` and `keyReleased()` functions are from `p5.js` library.

At the top of this file is the **object** class, which defines the properties of the game objects. Inside **object**, the properties (`this.X`, `this.Y`), (`this.vecX`, `this.vecY`), and (`this.speed`) correspond to the object’s position, movement direction, and speed, respectively. The `vec(chaseX, chaseY)` method changes the object’s movement direction, and the `posit()` method updates the object’s position.

Let’s look further down the code for a moment. I have defined clownfish, shark, and pufferfish as instances of the **object** data type.

The `clownfish_motion()` function describes the motion of the clownfish. It continually updates the clownfish’s `vec()` so that its movement direction is always toward the position of the worm, meaning it constantly moves toward the worm.


The `shark_motion()` function describes the motion of the shark. It includes an if statement:
``` Javascript
if (shark.X <= 0 || shark.X >= width || shark.Y <= 0 || shark.Y >= height)
{
    shark.vec(worm.X, worm.Y);
}
```
The if statement specifies that whenever the shark touches the edge of the window, it changes its movement direction toward the worm. After this change, the shark moves in a straight line.


The `pufferfish_motion()` function describes the motion of the pufferfish. It includes an if statement as well. 
``` JS
if (Math.sqrt((pufferfish.X - worm.X)**2 + (pufferfish.Y - worm.Y)**2) <= 150)
{
    pufferfish.speed = 8;
    pufferfish.vec(worm.X, worm.Y);
    pufferfish.posit();
    t_r = t.getSeconds();
}
```
This specifies that whenever the worm and the pufferfish are within a certain distance (150px in this case), the pufferfish will chase the worm. Otherwise, the pufferfish will change its movement direction randomly whenever abs(t.getSeconds() - t_r) > 1.
``` JS
else {
    pufferfish.speed = 6;

    if (abs(t.getSeconds() - t_r) > 1) {
        t_r = t.getSeconds();
        pufferfish.vec(Math.random() * width, Math.random() * height);
    }
    pufferfish.posit();
    }
```
Notice that in the `if` above, it updates `t_r = t.getSeconds()`, ensure that when the worm moves out of the pufferfish chasing range, the pufferfish will not possibly change its movement direction instantly.


Look back to the top, broccoli extends the **object** class and has an additional constructor property `this.t`. Which determine at what time during the 1-second period the broccoli will change its movement direction.

The `broccoli_motion()` function describes the motion of the broccoli. The first `if` statement makes the broccoli changes its movement direction randomly at `this.t <= t <= this.t + 50`. The second `if`,
```JS
if (Math.sqrt((worm.X - b.X)**2 + (worm.Y - b.Y)**2) <= (worm_size + broccoli_size) / 2)
    {
        b.X = Math.random() * width;
        b.Y = Math.random() * height;
        points++;
    }
```
This if statement specifies that whenever the worm touches a broccoli, the broccoli changes its position to a new random place and the player gets one point.

The worm has its own data type **Worm**, which also extends **object**. It includes a specific method `motion()` to control its movement direction using the WASD keys on the keyboard.


The `is_touched()` function detects whether worm is catched by shark, clownfish or pufferfish.

In the `draw()` function, there is
```JS
if (points >= 3 || is_touched()) 
    {
        over();w
        noLoop();
    }
```
If player get enough points or is catched by other fish, the game is over.

If the player wins, they can add a comment and see their score on the leaderboard on the index route or the history board on the me route.

### Web architecture
In `auth_helpers.py`, there is the **login_required** function to check if the user is logged in.

In `app.py`, the index route (`"/"`) renders the `index.html` template, displaying the leaderboard for the game by fetching data from the **rank** table in the database.
``` python
players = db.execute("SELECT * , ROW_NUMBER() OVER ( ORDER BY played_time ASC) AS rankNumber FROM rank JOIN users ON rank.user_id = users.id LIMIT 15")
```

If the user reaches the game route (`”/game”`) via a POST request, store the game details (user_id, score, time_played, comment) in the database.
```python
db.execute("INSERT INTO rank (user_id, played_time, time, comment) VALUES (?, ?, ?, ?)", session.get("user_id"), played_time, t, comment)
```

In `"/me"`, the webpage displays the game history of the user, similar to the leaderboard shown in `"/"`.

For the other routes (`"/login"`, `"/logout"`, `"/register"`), they follow a structure similar to the routes implemented in the **finance** problem set from week 9 of CS50x in 2024.

I referenced the tutorial on Bootstrap by [Net Ninja](https://youtube.com/playlist?list=PL4cUxeGkcC9joIM91nLzd_qaH_AimmdAR&si=VqlWNT6XHN0QtfrU) and other websites like [geeksforgeeks](https://www.geeksforgeeks.org/) and [MDN Web Doc](https://developer.mozilla.org/en-US/), and built my own webpage.


## Pictures
Home page:
![Home](/README_IMG/Home.png)

Mobile home page:
![Mobile home](/README_IMG/Mobile_home.png)

Me page:
![Me](/README_IMG/Me.png)

Win screen:
![Home](/README_IMG/GameWin.png)

Lose screen:
![Home](/README_IMG/GameLose.png)
