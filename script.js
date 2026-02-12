const URL = "https://teachablemachine.withgoogle.com/models/0_L8aMgqY/";  

let model;
let isModelReady = false;

async function init() {
    try {
        model = await tmImage.load(
            URL + "model.json",
            URL + "metadata.json"
        );

        isModelReady = true;
        document.getElementById("status").innerText = "✅ AI พร้อมใช้งานแล้ว";
        document.getElementById("imageUpload").disabled = false;

        console.log("Model loaded successfully");

    } catch (error) {
        console.error(error);
        document.getElementById("status").innerText = "❌ โหลดโมเดลไม่สำเร็จ";
    }
}

init();

document.getElementById("imageUpload").addEventListener("change", async function (event) {

  if (!isModelReady) {
    alert("⏳ โมเดลกำลังโหลด กรุณารอสักครู่");
    return;
  }

  const image = document.getElementById("preview");
  image.src = URL.createObjectURL(event.target.files[0]);

  image.onload = async () => {
    const prediction = await model.predict(image, false);

    prediction.sort((a, b) => b.probability - a.probability);

    const best = prediction[0];

    document.getElementById("result").innerHTML =
      `🗑️ ประเภทขยะ: <b>${best.className}</b><br>
       🎯 ความมั่นใจ: ${(best.probability * 100).toFixed(2)}%`;
  };
});
