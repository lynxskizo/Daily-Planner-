// Firebase Cloud Function-এর URL (যেখানে Gemini API সংযুক্ত করা আছে)
const FIREBASE_FUNCTION_URL = "https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/studyPlusChat";

// চ্যাটবটে মেসেজ পাঠানোর মূল ফাংশন
async function sendStudyPlusMessage(promptText, imageFileInput = null) {
  let base64Image = null;
  let mimeType = null;

  // যদি ব্যবহারকারী কোনো ছবি আপলোড করে
  if (imageFileInput && imageFileInput.files[0]) {
    const file = imageFileInput.files[0];
    base64Image = await convertFileToBase64(file);
    mimeType = file.type;
  }

  const payload = {
    prompt: promptText,
    imageBase64: base64Image,
    mimeType: mimeType
  };

  try {
    const response = await fetch(FIREBASE_FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return data.response; // শিক্ষা সংক্রান্ত উত্তর
  } catch (error) {
    console.error("Error connecting to StudyPlus AI:", error);
    return "দুঃখিত, সংযোগ তৈরিতে সমস্যা হচ্ছে। আবার চেষ্টা করুন।";
  }
}

// ফাইলকে Base64 স্ট্রিপে রূপান্তর করার ফাংশন
function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
