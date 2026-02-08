async function start() {
  const cartel = document.getElementById("cartel-img");
  const video = document.getElementById("bg-video");
  const audio = document.getElementById("bg-audio");
  const invtationImg = document.getElementById("invitation-img");
  const introDiv = document.getElementById("intro-content");
  const invitationDiv = document.getElementById("invitation-div");

  video.currentTime = 3.0;
  audio.currentTime = 0;

  await Promise.all([video.play(), audio.play()]);

  setTimeout(() => {
    cartel.classList.add("hide");
  }, 950);

  setTimeout(() => {
    invtationImg.style.display = "block";
    invtationImg.classList.add("animate");
  }, 9000);

  setTimeout(() => {
    introDiv.style.display = "none";
    invitationDiv.style.display = "block";
  }, 13000);
}

const LOCAL_STORAGE_KEY = "shrek-my-character";

const _supabase = supabase.createClient(
  "https://fpacxhrdwighjvdmnnrp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwYWN4aHJkd2lnaGp2ZG1ubnJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NjQzNjksImV4cCI6MjA4NjA0MDM2OX0.pslM_nRiyfrUPW_ZQkEnU2Ox4lJt60_7V9faWBY85lA",
);

const CHARACTERS = [
  { name: "Shrek", img: "shrek.jpg" },
  { name: "Asno", img: "asno.webp" },
  { name: "Fiona", img: "fiona.webp" },
  { name: "Gato con Botas", img: "gato.webp" },
  { name: "Dragona", img: "dragona.webp" },
  { name: "Dragsnos", img: "dragsno.webp" },
  { name: "Ogrito", img: "ogrito.jpg" },
  { name: "Rey Harold", img: "reyharold.jpg" },
  { name: "Reina Lillian", img: "Lillian.webp" },
  { name: "Jengi", img: "jenji.jpg" },
  { name: "Pinocho", img: "Pinocho.webp" },
  { name: "Lobo Feroz", img: "Lobo_Feroz.webp" },
  { name: "Cerdito 1", img: "cerdito1.webp" },
  { name: "Cerdito 2", img: "cerdito2.webp" },
  { name: "Cerdito 3", img: "cerdito3.webp" },
  { name: "Raton Ciego 1", img: "Raton1.webp" },
  { name: "Raton Ciego 2", img: "raton2.webp" },
  { name: "Raton Ciego 3", img: "Raton3.webp" },
  { name: "Padre Oso", img: "Tres_Osos.webp" },
  { name: "Artie", img: "Artie (1).webp" },
  { name: "Lord Farquaad", img: "lordfarq.jpeg" },
  { name: "Hada Madrina", img: "Hada_Madrina.webp" },
  { name: "Encantador", img: "encantador.jpg" },
  { name: "Rumpelstiltskin", img: "Rumpelstiltskin (1).webp" },
  { name: "Merlin", img: "merlin.webp" },
  { name: "Capitan Garfio", img: "capitangarfio.webp" },
  { name: "Doris", img: "Doris.webp" },
  { name: "Jero el Pastelero", img: "JeroelPastelero.webp" },
  { name: "Blancanieves", img: "Blancanieves.webp" },
  { name: "Cenicienta", img: "Cenicienta.webp" },
  { name: "Bella Durmiente", img: "Bella_Durmiente.webp" },
  { name: "Rapunzel", img: "Rapunzel.webp" },
  { name: "Mabel", img: "mabel.jpeg" },
  { name: "Ciclope", img: "ciclope.webp" },
  { name: "Brogan", img: "Brogan.webp" },
  { name: "Cocinillas", img: "cocinillas.webp" },
  { name: "Gretchen", img: "Gretche.webp" },
  { name: "Thelonio", img: "thelonious.webp" },
  { name: "Espejo Magico", img: "EspejoMagico.webp" },
  { name: "El Flautista", img: "Flautista.webp" },
  { name: "Robin Hood", img: "Robin_Hood.webp" },
  { name: "Geppetto", img: "gepeto.webp" },
  { name: "Humpty Dumpty", img: "Humpty_alexander_dumpty.webp" },
  { name: "Kitty Patitas Suaves", img: "kittypatitassuaves.jpg" },
  { name: "Campanilla", img: "campanilla.webp" },
  { name: "Caperucita Roja", img: "caperucita.jpg" },
  { name: "Peter Pan", img: "Peter_Pan.webp" },
  { name: "La Anciana en el Zapato", img: "Anciana.webp" },
];

renderCharacters();

async function selectCharacter(character) {
  let actualCharacter = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (actualCharacter == character.name) {
    await openConfirmModal(
      "Ya seleccionado",
      `Ya eres ${character.name}`,
      false,
    );
    return;
  }

  let message = ``;
  if (actualCharacter)
    message = `Ya habias seleccionado a ${actualCharacter}... `;

  message += `Elegir a ${character.name}`;

  const accepted = await openConfirmModal("Confirmar seleccion", message);

  if (!accepted) return;

  const name = character.name;
  const { error } = await _supabase.from("personajes").insert({ name: name });

  if (error) {
    await openConfirmModal(
      "No se pudo seleccionar",
      "Alguien se te ha adelantado",
      false,
    );
  } else {
    if (actualCharacter) await clearCharacter(actualCharacter);
    localStorage.setItem(LOCAL_STORAGE_KEY, name);
  }
  renderCharacters();
}

async function renderCharacters() {
  const ocupados = await loadCharacters();

  const mySelection = localStorage.getItem(LOCAL_STORAGE_KEY);
  const container = document.getElementById("characters-selection");

  container.innerHTML = "";

  for (const character of CHARACTERS) {
    let className = "available";

    if (character.name === mySelection) {
      className = "my-selection";
    } else if (ocupados.find((x) => x.name == character.name)) {
      className = "not-available";
    }

    const characterDOM = createCharacterDOM(character, className);
    characterDOM.onclick = () => selectCharacter(character);

    container.appendChild(characterDOM);
  }

  //Clear selected char of browser cache if does not exist
  if (mySelection && !CHARACTERS.find((x) => x.name == mySelection)) {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
}

function createCharacterDOM(character, className) {
  const div = document.createElement("div");
  div.className = `character ${className}`;

  const img = document.createElement("img");
  img.src = `assets/characters/${character.img}`;
  img.alt = character.name;
  img.onerror = "this.src='assets/characters/not-found-png';";

  const span = document.createElement("span");
  span.textContent = character.name;

  div.appendChild(img);
  div.appendChild(span);

  return div;
}

async function loadCharacters() {
  const { data, error } = await _supabase.from("personajes").select("*");

  if (error) {
    console.error(error);
    return;
  }

  return data;
}

async function clearCharacter(name) {
  await _supabase.from("personajes").delete().eq("name", name);

  if (localStorage.getItem(LOCAL_STORAGE_KEY) === name) {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }

  renderCharacters();
}

function openConfirmModal(title, subtitle, showCancel = true) {
  return new Promise((resolve) => {
    modalResolve = resolve;

    document.getElementById("modal-title").textContent = title;
    document.getElementById("modal-subtitle").textContent = subtitle;

    const actions = document.getElementsByClassName("modal-actions")[0];
    const cancelBtn = document.getElementById("modal-cancel");

    cancelBtn.style.display = showCancel ? "inline-block" : "none";
    actions.classList.toggle("single", !showCancel);

    document.getElementById("modal-overlay").classList.remove("hidden");
  });
}

function closeModal(result) {
  document.getElementById("modal-overlay").classList.add("hidden");

  if (modalResolve) {
    modalResolve(result);
    modalResolve = null;
  }
}
