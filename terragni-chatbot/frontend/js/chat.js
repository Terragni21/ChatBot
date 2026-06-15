/* =====================================================
   TERRAGNI CONSULTING CHATBOT — PROGRESSIVE DISCOVERY
   Dynamic follow-up suggestions after each answer
   ===================================================== */

const API_URL = "http://127.0.0.1:5000/chat";

let conversationHistory = [];
let isLoading = false;

const inputEl = document.getElementById("userInput");
let dynamicSuggestionsContainer = null;

// ---------- CURATED QUESTION TREE (static fallback if backend not available) ----------
// This maps each question to its answer and related follow-up questions.
// Used when backend is offline OR to supplement backend responses.
const localKnowledgeBase = new Map();

function normalizeQuestion(q) {
  return q.toLowerCase().replace(/[?.,!]$/, '').trim();
}

// Define the question tree
const questionTree = {
  // EAS Reports branch
  "Give me a complete overview of all EAS friction reports": {
    answer: `The **EAS (Effort Assessment Score) friction reports** analyse customer effort and behavioural friction across Indian financial services & insurance. Three major reports exist: \n\n• **2018 report** – first comprehensive friction index, identified hidden sludge in loan applications and KYC. \n• **2023 report** – revealed persistent friction in health insurance claims and mutual fund redemptions. \n• **2026 report "The Great Awakening"** – found personal lending as the most frustrating sector, with dark patterns in digital journeys. \n\nEach report measures EAS (higher = more friction) and provides sector-wise rankings.`,
    followUps: [
      "Summarise the 2018 friction report",
      "What are the key findings of the 2023 report?",
      "Which banks have the least friction?",
      "Summarise the 2026 friction report (\"The Great Awakening\")",
      "What makes personal lending the most frustrating sector?"
    ]
  },
  "Summarise the 2018 friction report": {
    answer: `The **2018 EAS report** was the first large‑scale friction benchmark in India. Key highlights:\n• Top friction points: loan documentation redundancy, excessive branch visits for KYC.\n• Telecom and insurance had moderately high effort scores.\n• Banks with digital onboarding showed lower friction.\n• Coined "de‑sludging" as a framework to reduce unnecessary steps.\nReport sparked early industry conversations around behavioural operations.`,
    followUps: ["What are the key findings of the 2018 report?", "Which banks have the least friction?", "Give me a complete overview of all EAS friction reports"]
  },
  "What are the key findings of the 2018 report?": {
    answer: `🔍 **2018 report key findings**:\n1. Customers spent 7+ extra steps on average for credit card activation.\n2. Insurance claim forms asked for duplicate information in 63% of cases.\n3. 72% of users abandoned loan applications due to unclear document requirements.\n4. First-ever "Friction Heatmap" by sector.`,
    followUps: ["Summarise the 2018 friction report", "What are dark patterns? Give examples from the reports."]
  },
  "Summarise the 2023 friction report": {
    answer: `The **2023 report** revealed persistence of friction despite digitisation. Major insights:\n• Health insurance claims: "the paradox" – high digital adoption yet 58% customers faced rework for claim approval.\n• Mutual funds: exit load disclosures buried, causing surprise friction.\n• Mobile banking: navigation friction rose due to feature bloat.\n• Personal loans remained the highest‑friction product overall.`,
    followUps: ["What are the key findings of the 2023 report?", "What is the health insurance paradox?", "What problems remain in mutual funds?"]
  },
  "What are the key findings of the 2023 report?": {
    answer: `📌 **Key findings of 2023**:\n- Health insurance: customers spent average 4.5 follow‑up calls per claim.\n- Mutual funds: SIP modification had 23% task failure rate.\n- Savings account closure required branch visit in 74% of banks.\n- Friction cost: 12% customer attrition due to avoidable sludge.`,
    followUps: ["Summarise the 2023 friction report", "What is the health insurance paradox?"]
  },
  "Which banks have the least friction?": {
    answer: `Based on EAS reports, banks with **least friction** include: HDFC Bank (digital journey optimisation), Kotak Mahindra Bank (low‑friction onboarding), and new‑age neobanks (Jupiter, Fi). Public sector banks showed highest friction in 2023, though some like SBI improved via YONO simplification. The reports note that friction varies by product – credit cards vs loans.`,
    followUps: ["Summarise the 2023 friction report", "What makes personal lending the most frustrating sector?"]
  },
  "Summarise the 2026 friction report (\"The Great Awakening\")": {
    answer: `**2026 report: "The Great Awakening"** – focus on dark patterns and emotional friction.\n• Found that 81% of users experienced manipulative design (e.g., hidden cancellation, forced continuity).\n• Personal lending tops frustration due to bait pricing and confusing EMI calculators.\n• Life insurance historic inertia: legacy processes still haunt.\n• Introduced "Behavioural Friction Index" (BFI) including psychological resistance.`,
    followUps: ["What are the key findings of the 2026 report?", "What makes personal lending the most frustrating sector?", "What are dark patterns? Give examples from the reports."]
  },
  "What are the key findings of the 2026 report?": {
    answer: `⚡ **2026 key findings**:\n- 3 out of 4 customers felt "trapped" in loan prepayment processes.\n- 68% reported that websites used manipulative urgency (fake stock counters).\n- Health insurance still paradoxically high effort.\n- Friction costs Indian economy an estimated ₹48,000 Cr annually.`,
    followUps: ["Summarise the 2026 friction report (\"The Great Awakening\")", "What are dark patterns? Give examples from the reports."]
  },
  "What makes personal lending the most frustrating sector?": {
    answer: `Personal lending leads in friction due to:\n• Multiple document uploads (salary slips, bank statements) across unintegrated systems.\n• Hidden processing fees & insurance cross‑sell traps.\n• Vague rejection reasons without actionable feedback.\n• Aggressive follow‑up calls after application.\nEAS 2026 scored personal loans at 84/100 (highest friction).`,
    followUps: ["What are dark patterns? Give examples from the reports.", "Which banks have the least friction?"]
  },
  "What is the health insurance paradox?": {
    answer: `The **health insurance paradox** (EAS 2023): Even though digital claim filing exists, customers face excessive friction – repeated calls, contradictory requirements, and long settlement times. Insurers invest in tech, but process complexity and misaligned incentives create more friction, not less. Result: high NPS but low loyalty.`,
    followUps: ["What problems remain in mutual funds?", "Summarise the 2023 friction report"]
  },
  "What are dark patterns? Give examples from the reports.": {
    answer: `**Dark patterns** = UI tricks that manipulate users into unintended actions. EAS reports document: \n• "Hidden subscription" opt‑outs during loan applications.\n• "Confirm shaming" – making cancellation emotionally difficult.\n• Forced continuity – free trials auto‑convert to paid.\n• Drip pricing (fees disclosed only at final step).\nExamples from 2026 report: personal loan pages showing fake "only 2 slots left".`,
    followUps: ["What makes personal lending the most frustrating sector?", "Summarise the 2026 friction report (\"The Great Awakening\")"]
  },
  // Terragni Company branch
  "What is Terragni Consulting?": {
    answer: `Terragni Consulting is a **behavioural friction firm** that helps organisations remove hidden resistance between knowing and doing. We combine cognitive science, behavioural economics, and friction audits to redesign processes, policies, and digital journeys. Our mission: make business move by shifting behaviour, not just systems.`,
    followUps: ["What does Terragni Consulting do?", "What is the main motive of Terragni?", "What sciences does Terragni use?"]
  },
  "What does Terragni Consulting do?": {
    answer: `We diagnose, decode, design and deliver friction‑free experiences. Services:\n• Friction audits (EAS framework)\n• Behavioural intervention design\n• De‑sludging programs for banks, insurance, fintech\n• Training on behavioural operations & JUMP / Lens toolkits\n• ME (My Experience) pulse measurement.`,
    followUps: ["What is the main motive of Terragni?", "What is the FMC Model (Friction, Motivation, Context)?", "What is the 4‑step process (Diagnose, Decode, Design, Deliver)?"]
  },
  "What is the main motive of Terragni?": {
    answer: `The main motive of Terragni Consulting is to eliminate **behavioural friction** – the unseen resistance between knowing and doing. We aim to understand actual human behaviour, identify root causes of friction, and design contextual interventions that reshape motivation and action. Goal: make businesses move by shifting behaviour, not just by improving systems.`,
    followUps: ["What is behavioural friction in simple words?", "What problems does Terragni fix for customers, employees and channel partners?", "What makes Terragni different from other consulting firms?"]
  },
  "What is behavioural friction in simple words?": {
    answer: `Behavioural friction = any mental, emotional, or physical effort that slows or stops a person from doing what they intend. It's why we abandon forms, delay decisions, or get frustrated. Terragni finds these invisible barriers and removes them. Example: a confusing bank OTP flow or an insurance claim with 10 unnecessary steps.`,
    followUps: ["What is the FMC Model (Friction, Motivation, Context)?", "How does Terragni find and fix customer frustration?"]
  },
  "What is the FMC Model (Friction, Motivation, Context)?": {
    answer: `**FMC Model** – Terragni’s proprietary framework:\n• **Friction**: barriers that block action (effort, confusion, anxiety).\n• **Motivation**: internal drivers and rewards.\n• **Context**: situational cues, environment, timing.\nBehaviour change occurs when you reduce friction, enhance motivation, and design context. Most firms only fix processes – we fix all three.`,
    followUps: ["What is the 4‑step process (Diagnose, Decode, Design, Deliver)?", "Why is context the most underestimated lever in business?"]
  },
  "How does Terragni find and fix customer frustration?": {
    answer: `We use **friction archaeology** – observing real behaviour, session replays, customer friction walks, and tools like JUMP (implicit bias test) and Lens (customer insight engine). We then run rapid interventions (context changes, choice architecture) and measure EAS shift. No generic surveys – only behavioural diagnosis.`,
    followUps: ["What is JUMP? How does it identify hidden biases?", "What is Lens? How does it provide customer insights?", "What is the Magic Box toolkit?"]
  },
  "What sciences does Terragni use?": {
    answer: `We apply behavioural economics (Kahneman, Thaler), cognitive psychology (heuristics, attention), social psychology (norms, identity), and decision science. Combined with design thinking and habit formation models. This scientific stack helps us predict and reshape friction.`,
    followUps: ["What is the FMC Model?", "What makes Terragni different from other consulting firms?"]
  },
  "What is the Magic Box toolkit?": {
    answer: `**Magic Box** is Terragni's low‑fidelity prototyping toolkit to design and test friction‑fixes in real time. Contains trigger cards, intervention blueprints, and behaviour maps. Used in workshops to co‑create solutions with client teams.`,
    followUps: ["What is JUMP? How does it identify hidden biases?", "What is Lens?"]
  },
  "What is the 4‑step process (Diagnose, Decode, Design, Deliver)?": {
    answer: `Terragni’s signature method:\n1. **Diagnose** – friction audit & EAS measurement.\n2. **Decode** – root cause analysis (behavioural diagnostics).\n3. **Design** – targeted interventions (choice architecture, nudges, process streamlining).\n4. **Deliver** – test, iterate & scale.`,
    followUps: ["What is the FMC Model?", "How does Terragni find and fix customer frustration?"]
  },
  // Contact branch
  "How can I start a conversation with Terragni?": {
    answer: `You can reach out via:\n• Website: www.terragni.in/contact\n• Email: hello@terragni.in\n• LinkedIn: Terragni Consulting\nWe’ll schedule a friction discovery call. Also subscribe to **SHIFT newsletter** for behavioural insights.`,
    followUps: ["What is the SHIFT newsletter and how can I join it?", "How can I get a copy of the full EAS reports?", "What are Terragni's contact details (phone, email, address)?"]
  },
  "What is the SHIFT newsletter and how can I join it?": {
    answer: `**SHIFT** is a monthly newsletter about behavioural friction, de‑sludging, and human engagement. Join via terragni.in/shift – free. Each issue includes a "Friction Fix" case study.`,
    followUps: ["How can I get a copy of the full EAS reports?", "How can I start a conversation with Terragni?"]
  },
  "How can I get a copy of the full EAS reports?": {
    answer: `Full EAS reports (2018, 2023, 2026 executive summaries) are available upon request. Contact hello@terragni.in with subject "EAS Report Request". Enterprises can license the detailed sector datasets.`,
    followUps: ["Summarise the 2026 friction report (\"The Great Awakening\")", "Which banks have the least friction?"]
  }
};

// Populate localKnowledgeBase Map
for (const [q, data] of Object.entries(questionTree)) {
  localKnowledgeBase.set(normalizeQuestion(q), data);
}

// Helper: get answer from local tree or fallback
function getLocalAnswer(questionText) {
  const normalized = normalizeQuestion(questionText);
  if (localKnowledgeBase.has(normalized)) {
    return localKnowledgeBase.get(normalized);
  }
  // Try partial match
  for (let [key, value] of localKnowledgeBase.entries()) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }
  return null;
}

// ---------- UI Helpers ----------
function updateStatus(connected) {
  const statusDot = document.getElementById('statusDot');
  const statusLabel = document.getElementById('statusLabel');
  if (connected) {
    statusDot.classList.add('online');
    statusLabel.textContent = 'Online';
  } else {
    statusDot.classList.remove('online');
    statusLabel.textContent = 'Offline';
  }
}

function convertToLinks(text) {
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
  return text.replace(urlRegex, function(url) {
    let href = url;
    if (!url.startsWith('http')) href = 'http://' + url;
    return `<a href="${href}" target="_blank" style="color: #7030A0; text-decoration: underline;">${url}</a>`;
  });
}

function getUserAvatar() {
  const avatar = document.createElement("div");
  avatar.className = "avatar user-avatar";
  avatar.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
  </svg>`;
  return avatar;
}

function getBotAvatar() {
  const avatar = document.createElement("div");
  avatar.className = "avatar bot-avatar";
  avatar.style.background = "transparent";
  avatar.style.boxShadow = "none";
  avatar.style.padding = "0";
  avatar.style.overflow = "hidden";
  avatar.style.borderRadius = "12px";
  const img = document.createElement("img");
  img.src = "terragni T logo.png";
  img.alt = "Terragni Consulting";
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "contain";
  img.style.borderRadius = "12px";
  img.onerror = function() {
    avatar.style.background = "linear-gradient(135deg, #7030A0 0%, #2D1B3D 100%)";
    avatar.style.display = "flex";
    avatar.style.alignItems = "center";
    avatar.style.justifyContent = "center";
    avatar.textContent = "T";
    avatar.style.color = "#FFDE00";
    avatar.style.fontSize = "0.85rem";
    avatar.style.fontWeight = "700";
    avatar.removeChild(img);
  };
  avatar.appendChild(img);
  return avatar;
}

function addMessage(role, content, sourceTag) {
  const messages = document.getElementById("messages");
  const msgDiv = document.createElement("div");
  msgDiv.className = `msg ${role}`;
  if (role === "user") {
    msgDiv.appendChild(getUserAvatar());
  } else {
    msgDiv.appendChild(getBotAvatar());
  }
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  let html = content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>");
  if (role === "bot") {
    html = convertToLinks(html);
  }
  const paragraphs = html.split(/\n\n+/);
  html = paragraphs.map(para => {
    if (/^\s*[-•]/.test(para)) {
      const items = para.split("\n").filter(l => l.trim()).map(l => `<li>${l.replace(/^\s*[-•]\s*/, "")}</li>`).join("");
      return `<ul>${items}</ul>`;
    }
    return `<p>${para.replace(/\n/g, "<br>")}</p>`;
  }).join("");
  bubble.innerHTML = html;
  msgDiv.appendChild(bubble);
  messages.appendChild(msgDiv);
  setTimeout(() => {
    messages.scrollTop = messages.scrollHeight;
  }, 100);
  return msgDiv;
}

function showTyping() {
  const messages = document.getElementById("messages");
  const msgDiv = document.createElement("div");
  msgDiv.className = "msg bot";
  msgDiv.id = "typing-msg";
  msgDiv.appendChild(getBotAvatar());
  const indicator = document.createElement("div");
  indicator.className = "typing-indicator";
  indicator.innerHTML = "<span></span><span></span><span></span>";
  msgDiv.appendChild(indicator);
  messages.appendChild(msgDiv);
  messages.scrollTop = messages.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById("typing-msg");
  if (el) el.remove();
}

// ---------- DYNAMIC SUGGESTIONS (inside chat) ----------
function displayDynamicSuggestions(suggestions) {
  // Remove previous dynamic suggestions container if exists
  if (dynamicSuggestionsContainer && dynamicSuggestionsContainer.parentNode) {
    dynamicSuggestionsContainer.remove();
  }
  if (!suggestions || suggestions.length === 0) return;
  
  const messagesContainer = document.getElementById("messages");
  dynamicSuggestionsContainer = document.createElement("div");
  dynamicSuggestionsContainer.className = "dynamic-suggestions";
  
  suggestions.forEach(suggestion => {
    const chip = document.createElement("button");
    chip.className = "dynamic-chip";
    chip.textContent = suggestion;
    chip.onclick = () => {
      // Remove current dynamic suggestions before sending new question
      if (dynamicSuggestionsContainer && dynamicSuggestionsContainer.parentNode) {
        dynamicSuggestionsContainer.remove();
      }
      inputEl.value = suggestion;
      sendMessage();
    };
    dynamicSuggestionsContainer.appendChild(chip);
  });
  
  messagesContainer.appendChild(dynamicSuggestionsContainer);
  setTimeout(() => {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, 100);
}

// ---------- MAIN SEND MESSAGE (with backend + local fallback) ----------
async function sendMessage() {
  if (isLoading) return;
  const text = inputEl.value.trim();
  if (!text) return;
  
  isLoading = true;
  document.getElementById("sendBtn").disabled = true;
  inputEl.value = "";
  inputEl.style.height = "auto";
  
  addMessage("user", text);
  conversationHistory.push({ role: "user", content: text });
  showTyping();
  
  let reply = "";
  let followUpQuestions = [];
  let usedLocal = false;
  
  try {
    // Try backend first
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conversationHistory })
    });
    
    if (response.ok) {
      const data = await response.json();
      if (!data.error) {
        reply = data.reply;
        conversationHistory.push({ role: "assistant", content: reply });
        updateStatus(true);
        // Try to get follow-ups from local tree based on user's question
        const localData = getLocalAnswer(text);
        if (localData && localData.followUps) {
          followUpQuestions = localData.followUps;
        } else {
          // fallback: extract from reply? but better to have defaults
          followUpQuestions = ["What is behavioural friction?", "What does Terragni Consulting do?", "Which banks have the least friction?"];
        }
      } else {
        throw new Error(data.error);
      }
    } else {
      throw new Error(`Server status ${response.status}`);
    }
  } catch (err) {
    console.warn("Backend error, using local knowledge:", err);
    updateStatus(false);
    // Use local knowledge base
    const localData = getLocalAnswer(text);
    if (localData) {
      reply = localData.answer;
      followUpQuestions = localData.followUps;
    } else {
      reply = `I'm sorry, I don't have an answer for that. Please try one of the suggested questions below or check our website.`;
      followUpQuestions = ["Give me a complete overview of all EAS friction reports", "What is Terragni Consulting?", "What is the FMC Model?"];
    }
    usedLocal = true;
    // Still add to conversation history for continuity
    conversationHistory.push({ role: "assistant", content: reply });
  }
  
  removeTyping();
  addMessage("bot", reply, "");
  
  // Display dynamic follow-up suggestions inside chat
  displayDynamicSuggestions(followUpQuestions);
  
  isLoading = false;
  document.getElementById("sendBtn").disabled = false;
  inputEl.focus();
}

// ---------- Handle static chip clicks ----------
function handleChipClick(btn) {
  const question = btn.getAttribute("data-question");
  if (question) {
    inputEl.value = question;
    sendMessage();
  }
}

// Attach event listeners to static chips after DOM load
function initStaticChips() {
  const chips = document.querySelectorAll(".chip");
  chips.forEach(chip => {
    chip.removeEventListener("click", window._chipHandler);
    window._chipHandler = () => handleChipClick(chip);
    chip.addEventListener("click", window._chipHandler);
  });
}

// Also handle send button
document.getElementById("sendBtn").onclick = sendMessage;

// Input auto-resize and enter
inputEl.addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = Math.min(this.scrollHeight, 110) + "px";
});
inputEl.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Health check
async function checkBackendHealth() {
  try {
    const response = await fetch("http://127.0.0.1:5000/health");
    if (response.ok) {
      updateStatus(true);
      return true;
    } else {
      updateStatus(false);
      return false;
    }
  } catch (err) {
    updateStatus(false);
    return false;
  }
}

// Initial greeting
window.addEventListener("load", async () => {
  await checkBackendHealth();
  initStaticChips();
  setTimeout(() => {
    addMessage("bot", `Welcome to Terragni Consulting AI Assistant.\n\nI can help you understand:\n- How Terragni helps companies reduce customer friction\n- Key findings from our EAS research reports\n- Customer friction in banking, insurance, and other sectors\n- Company information and leadership\n\n**Select a Quick question above** or type your own. After each answer, I'll suggest related questions right here in the chat.`, "");
  }, 400);
});