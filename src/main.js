import kaboom from "kaboom"

let highScore = 0;
const k = kaboom()

k.loadSprite("bean", "sprites/bean.png");
k.loadSprite("bg", "sprites/bg.png");
k.loadSprite("pipe", "sprites/pipe.png");

k.loadSound("jump", "sounds/jump.mp3");
k.loadSound("bruh", "sounds/bruh.mp3");
k.loadSound("pass", "sounds/pass.mp3");



k.add([
	k.pos(120, 80),
	k.sprite("bean"),
])

k.onClick(() => k.addKaboom(k.mousePos()))


// Game scene
screen("game", () => {});
	const PIPE_GAP = 140;
	let score = 0;
	setGravity(1600);

	add([
		sprite("bg", { width: width(), height: height() })
	]);

	const scoreText = add([text(score), pos(12, 12)]);

	const player = add([
		sprite("bird"),
		scale(1.2),
		pos(100, 50),
		area(),
		body(),
	]);

	onKeyPress("space", () => {
		player("jump");
		player.jump(400);
	});

	function createPipes() {
		const offset = rand(-50, 50);

		// bottom pipe
		add ([
			sprite("pipe"),
			pos(width(), height() / 2 + offset + PIPE_GAP / 2),
			"pipe",
			scale(2),
			area(),
			{ passed: false },
		]);

		// top pipe
		add ([
			sprite("pipe", { flipY: true}),
			pos(width(), height() / 2 + offset + PIPE_GAP / 2),
			"pipe",
			anchor("botleft"),
			scale(2),
			area()
		]);
	}

	loop(1.5, () => createPipes());

	onUpdate("pipe", (pipe) => {
		pipe.move(-300, 0);

		if (pipe.passed === false && pipe.pos.x < player.pos.x) {
			pipe.passed = true;
			score += 1;
			scoreText.text = score;
			play("pass");
		}
	});


	player.onCollide("pipe", () => {
		const ss = screenshot();
		go("gameover", score);
	});

	player.onUpdate(() => {
		if (player.pos.y > height()) {
			const ss = screenshot();
			go("gameover", score,ss);
		}
	});



	// For touch
	window.addEventListener("touchstart", () => {
		play("jump");
		player.jump(400);
	})



// Gameover scene
screen("gameover", (score,screenshot) => {
	if (score > highScore) highScore = score;

	play("bruh");

	loadSprite("gameOverScreen", screenshot);
	add([sprite("gameOverScreen", {width: width(), height: height() })]);


	add ([
		text("Gameover!\n" + "score: " + score + "\nHigh Score: " + highScore, { size: 45 }),
		pos(width() / 2, height() / 3),
	]);

	onKeyPress("space", () => {
		go("game");
	});

});