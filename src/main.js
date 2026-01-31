async function start() {
  console.log("clicked");
  const cartel = document.getElementById("cartel-img");
  const video = document.getElementById("bg-video");
  const audio = document.getElementById("bg-audio");
  const invtationImg = document.getElementById("invitation-img");
  const introDiv = document.getElementById("intro-content");
  const invitationDiv = document.getElementById("invitation-content");

  video.currentTime = 3.0;
  audio.currentTime = 0;

  await Promise.all([video.play(), audio.play()]);

  setTimeout(() => {
    cartel.classList.add("hide");
  }, 950);

  setTimeout(() => {
    invtationImg.style.display = "block";
    invtationImg.classList.add("animate");
  }, 11000);

  setTimeout(() => {
    introDiv.style.display = "none";
    invitationDiv.style.display = "block";
  }, 15000);
}
