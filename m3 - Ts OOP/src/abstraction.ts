abstract class MediaPlayer {
  abstract play(): void;
  abstract pause(): void;
  abstract stop(): void;
}

//implementation
class MezbaPlayer extends MediaPlayer {
  play() {
    console.log(`Playing music...`);
  }
  pause(): void {
    console.log("Music is paused !");
  }
  stop(): void {
    console.log("Music is stopped !");
  }
}

const mezbaPlayer1 = new MezbaPlayer();
mezbaPlayer1.play();