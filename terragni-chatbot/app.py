from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")  # ✅ From Railway environment variables
MODEL        = "llama-3.3-70b-versatile"

# ================================================================
# KNOWLEDGE BASE – FRICTION‑FIRST (EAS IS JUST THE TOOL)
# ================================================================

KNOWLEDGE_BASE = """
TERRAGNI CONSULTING - COMPLETE KNOWLEDGE BASE

================================================================================
COMPANY INFORMATION
================================================================================

- Founded: 2009 in Pune, India | 80% female workforce
- Years completed: 17 years (as of 2026)
- Name: Terra (Earth) + Agni (Fire) = "Ideas rooted in reality. Change that moves people."
- Tagline: "The Human Engagement Company"
- Phone: +91 895 698 2522 | Email: engage@terragni.com
- Website: www.terragni.in

ADDITIONAL BUSINESS INFORMATION:
- Yearly revenue of Terragni Consulting: Not publicly disclosed. For financial inquiries, contact directly.
- Countries where Terragni operates: Primarily India. Other countries are not specified.
- Number of branches in India: Not publicly specified. Headquarters in Pune.
- Clients: Works across banking, insurance, manufacturing, retail, healthcare, emerging businesses. Specific names confidential.

================================================================================
PEOPLE ENGAGEMENT TEAM
================================================================================

The People Engagement Team at Terragni Consulting focuses on making employees happier and more engaged. Their core belief is that when employees are frustrated, customers feel it. Therefore, they work to fix the internal employee experience first.

**What the team does:**
- Measures employee friction and engagement using the ME (My Experience) methodology.
- Designs culture transformation programs to build workplaces where employees feel valued and motivated.
- Provides coaching and leadership development (without naming specific leaders).
- Facilitates workshops on customer‑centricity, friction elimination, and behavioural science.
- Helps organisations hire the right talent through executive search support.

**Why it matters:** Frustrated employees cannot serve customers well. By improving employee experience, the People Engagement Team indirectly improves customer experience and business outcomes.

**Contact for People Engagement:** engage@terragni.com | +91 895 698 2522

================================================================================
WHAT TERRAGNI DOES (EXPANDED DETAILED VERSION)
================================================================================

**In one sentence:** Terragni helps companies eliminate behavioural friction – the unseen resistance between knowing and doing.

**The problem Terragni solves:**  
Most businesses look at strategy, structure, or process when something isn't moving. But the real barrier is almost always human behaviour. Customers hesitate, Employees freeze, Change slows, Growth underperforms, Investments underdeliver, The hidden cause is resistance between intent and action, That resistance is behavioural friction.

**How Terragni works – the core approach:**

1. **Sensemaking (Diagnose)** – They do NOT start with solutions. They start by understanding what is actually happening. Using behavioural science, consumer neuroscience, ethnography, and data, they answer three questions:  
   • What are people actually doing?  
   • Why are they doing it?  
   • What is stopping them from doing what the organisation needs?  
   This produces a friction map (where people get stuck), a motivation profile (what drives them), and a context audit (how environment shapes behaviour). It tells them exactly where to intervene and why.

2. **The FMC Model (Decode)** – Behaviour lives at the intersection of three forces:  
   • **Friction** – Anything that makes the desired behaviour harder (physical, cognitive, emotional, perceived).  
   • **Motivation** – The underlying drive or its absence. People do not fail to act because they lack information; they fail because the action doesn't connect to something that matters to them, or because the cost of acting feels greater than the benefit.  
   • **Context** – The environment that shapes every decision (defaults, cues, social signals, choice architecture). Context is the most underestimated lever in business. Change the context and behaviour changes – often without changing the person at all.  
   Most organisations address only one of these at a time. Terragni works across all three simultaneously.

3. **Intervention Design (Design & Deliver)** – With a clear diagnosis, they design targeted changes to journeys, environments, communications, systems, and structures. Their interventions are specific, testable, and built to sustain. They do not design for the launch; they design for what happens six months after it – when the energy fades and the real test of behaviour change begins.

**The logic that never changes:**  
Find the friction → Understand the motivation → Reshape the context.  
When behaviour shifts, business moves.

**Terragni's measurement tool:**  
- **EAS (Effort Assessment Score)** – Measures friction across Time, Physical, Cognitive, Emotional dimensions. The measurement tool, not the mission.

**What makes Terragni different:**  
Many firms improve systems. Terragni improves how people behave inside systems.  
Conventional focus: Process → Intent → Awareness → Activity  
Terragni focus: Decisions → Action → Adoption → Outcomes

**Industries served:** Banking, insurance, manufacturing, retail, healthcare, and emerging businesses.

**To start a conversation:** engage@terragni.com | +91 895 698 2522

================================================================================
HOW WE FIX IT – SENSEMAKING & FMC MODEL
================================================================================

CORE PRINCIPLE: "We do not start with solutions. We start with Sensemaking."

SENSEMAKING: Understand what is actually happening. Most interventions fail because they address the visible symptom, not the underlying behavioural driver.

THE 3 SENSEMAKING QUESTIONS:
• Q1: What are people actually doing?
• Q2: Why are they doing it?
• Q3: What is stopping them from doing what the organisation needs?

SENSEMAKING PRODUCES: friction map, motivation profile, context audit.

THE FMC MODEL (Friction · Motivation · Context):
- FRICTION: Anything that makes desired behaviour harder.
- MOTIVATION: Underlying drive or its absence. People don't fail from lack of information; they fail because action doesn't connect to what matters.
- CONTEXT: Environment shaping every decision. Most underestimated lever.

WHY ALL THREE MUST WORK TOGETHER: Behaviour lives at the intersection. Terragni works across all three simultaneously.

INTERVENTION DESIGN: Design for what happens six months after launch, not just the launch.

THE LOGIC: Find the friction → Understand the motivation → Reshape the context. When behaviour shifts, business moves.

================================================================================
EAS 2018 REPORT – SIMPLE, FRICTION‑FIRST SUMMARY
================================================================================

**What Terragni learned in 2018 (in plain English):**

Back in 2018, Terragni did its first big study on customer friction. Here's what they found:

• **The biggest problem was waiting.** Customers hated waiting with no updates. For example, applying for a loan and then hearing nothing for four days – that's "time friction".

• **Call centres were the worst.** Those long phone menus ("press 1 for…") made people repeat the same problem over and over. That's confusing (cognitive friction) and frustrating (emotional friction).

• **Different industries had different problems:**  
  - **Retail** was easiest – you could see and touch products.  
  - **Banking** was okay for simple things, but issues got complicated fast.  
  - **Insurance** was surprisingly easy to understand (low cognitive friction), but waiting times were long.  
  - **Telecom** had too many steps and too many calls (high physical friction).

• **The big lesson:** Companies rushed to put everything online to solve physical friction (like going to a branch). They succeeded – but accidentally created new kinds of friction (confusion, anxiety). That became the big story in later years.

**The real takeaway:** Customers don't just want speed – they want to know what's happening and not feel lost.

================================================================================
EAS 2023 REPORT – SIMPLE, FRICTION‑FIRST SUMMARY
================================================================================

**What Terragni learned in 2023 (in plain English):**

By 2023, a strange thing happened. Companies had spent billions on apps and digital tools – but customers felt **more** frustrated, not less. Here's why:

• **Physical friction was fixed, but mental friction exploded.** You could do things faster (less waiting, fewer steps), but everything felt confusing and overwhelming. Example: 50 insurance plans with no help to choose.

• **The worst part came after you bought something.** Customer support became a nightmare – repeated calls, long holds, no one knowing your history.

• **Banking example:** Half of all customers needed multiple tries for a simple transaction. And using the app didn't feel any easier than visiting a branch – the frustration just moved from "waiting in line" to "figuring out the screen".

• **E‑commerce:** Too many products, no good filters. 66% of people had to try several times just to find what they wanted. Online shopping complaints made up almost half of all consumer complaints in India.

• **Insurance:** Buying a policy became easy (good physical friction), but **claiming** was still a nightmare – 60% of all complaints were about claims. The industry fixed the front door and left the back door broken.

• **Retail (physical stores):** The biggest friction? The staff. People felt store employees didn't understand what they needed. That's not a tech problem – it's a training and culture problem.

• **The good news:** Some banks did better. The easiest banks were Kotak, Union Bank, ICICI, SBI, and PNB. Still, even they had room to improve.

**The bottom line:** Fixing speed and steps is not enough. You have to fix confusion and the feeling of being helpless. That's what Terragni calls "cognitive" and "emotional" friction.

================================================================================
EAS 2026 REPORT – SIMPLE, FRICTION‑FIRST SUMMARY ("THE GREAT AWAKENING")
================================================================================

**What Terragni learned in 2026 (in plain English):**

The 2026 report is called "The Great Awakening". It means Indian customers have woken up – they won't accept confusing or manipulative systems anymore.

**The big picture:**  
- Physical and time friction (waiting, steps) are mostly solved – apps work, things are faster.  
- But **cognitive friction** (confusion) is still a big problem.  
- And **emotional friction** (feeling cheated or helpless) is now a **critical failure** – customers feel manipulated.

**Now, let's look at each sector, in plain language:**

**Personal Lending (most frustrating of all)**  
- You apply for a loan, then hear nothing for 7‑12 days. In Singapore, approval is instant.  
- You upload the same document again and again. 95% of people face this.  
- You don't understand the terms – what does "FOIR" or "LTV" mean? Nobody explains.  
- You feel anxious and helpless.  
- What customers actually want: "Let me pause one EMI a year", "let me change the EMI date", "make prepayment easy".

**Health Insurance (the paradox)**  
- 89% of claims are approved – that's world‑class. Yet fewer people are buying insurance. Why?  
- Because the **experience** is terrible. Comparing plans is a nightmare (99% struggle).  
- During a claim, you get no updates. You have to call multiple times.  
- There's a nasty trick: claims rejected for "doctor handwriting not clear" – a made‑up reason to avoid paying.  
- Result: 430 million Indians remain uninsured, even though the product itself works.

**Life Insurance (a historic win – but not finished)**  
- For the first time ever, customers actually **understand** life insurance! That's called "cognitive friction neutrality".  
- Buying a policy and claiming are now easy.  
- But 57% are still confused about term insurance. 90% need multiple calls just to update basic info.  
- Another dirty trick: "commission churning" – agents push you to cancel your policy and buy a new one, so they earn commission. You lose 70% of your money.

**Mutual Funds (least frustrating, but still a problem)**  
- 91% of people struggle to compare funds. Most still rely on a human advisor (44%) because apps don't feel trustworthy.  
- There was a dark pattern: "deployment delay" – your money sat idle for months while the fund house earned fees. This has been fixed by SEBI.

**The single most important insight from 2026:**  
Customers don't complain about how long something takes. They complain about **not knowing where they stand**. They feel lost and manipulated.

So the real job for companies now is not to go faster – it's to be clear, honest, and respectful.

================================================================================
THINKING PAGE – ARTICLES, SHIFT NEWSLETTER, RESEARCH, LINKEDIN
================================================================================

DESCRIPTION: "This is where Terragni thinks out loud."

ARTICLES (4):
1. "An Evening of Enriching Discussions - Leadership in Organizations" (Jan 12, 2020)
2. "Insights from Children" (Jan 12, 2020)
3. "Consistency Trumps Moments of Brilliance" (Jan 12, 2020)
4. "Why Score Cards Seduce Us" (Jan 12, 2020)

THE SHIFT NEWSLETTER:
- India's only Behaviours for Business Community. 3,500+ leaders.
- Editions: #29 (Mar 20, 2026), #28 (Dec 23, 2025), #27 (Nov 23, 2025), #26 (Oct 17, 2025)

TERRAGNI RESEARCH:
- EAS Report 2026, 2023, Patient Experience 2019, Of Customer Effort and Journey.

LINKEDIN POSTS (key insights):
- Personal Lending: 95‑98% need multiple interactions, only 2% get same‑day closure.
- Mutual Funds: "Investing doesn't fail at awareness. It fails at behaviour."
- Health Insurance: "Clarity builds trust. Confusion kills growth."

================================================================================
DARK PATTERNS
================================================================================

Dark patterns are friction deliberately designed to confuse or manipulate customers.

Types: Hidden Information, Complexity as Strategy, Asymmetric Power, Forced Action, Subscription Traps.

Examples from EAS 2026:
- Health Insurance: "doctor handwriting not clear"
- Personal Lending: "No Policy, No Loan" forced insurance
- Life Insurance: commission churning – customers lose 70%
- Mutual Funds: deployment delay – idle money

================================================================================
BEHAVIOURAL FRICTION (7 types)
================================================================================

1. COGNITIVE – complexity, confusion
2. EMOTIONAL – fear, distrust
3. SOCIAL – norms, status risk
4. IDENTITY‑BASED – "not for people like me"
5. HABITUAL – old routines overpowering new intent
6. MOTIVATIONAL – weak relevance or reward
7. OPERATIONAL – effort, delays

PHYSICAL FRICTION: number of actions
TIME FRICTION: time taken

================================================================================
THE HIDDEN DRAG (6 barriers)
================================================================================

1. Confusion delays decisions
2. Habit defeats change
3. Distrust stalls commitment
4. Too much choice creates inertia
5. Weak incentives dilute action
6. Status risk blocks adoption

================================================================================
PROBLEMS WE FIX (8 problems across 3 areas)
================================================================================

CUSTOMERS (3): Acquisition without conversion, Engagement without depth, Retention without trust
EMPLOYEES (3): Adoption without internalisation, Productivity without engagement, Transformation without movement
CHANNELS (2): Activation without momentum, Compliance without commitment

================================================================================
HOW TO START A CONVERSATION WITH TERRAGNI
================================================================================

- Email: engage@terragni.com
- Phone: +918956982522
- Response within 1‑2 working days
- First conversations are exploratory. "You do not need the problem fully defined."

================================================================================
CORE PHILOSOPHY
================================================================================

- "Businesses do not change when strategy changes. They change when behaviour changes."
- "Behaviour shapes outcomes long before strategy does."
- "You may not have a strategy problem. You may have a behaviour problem."

================================================================================
PURPLE COLOR STORY
================================================================================

Purple does not exist in the spectrum. The brain CREATES purple when red and blue arrive together. Terragni chose purple because the most valuable ideas emerge at the intersection of disciplines.
"""

# Simple footer
FOOTER = "Want to learn more about it? Visit www.terragni.in"

SYSTEM_PROMPT = f"""You are Terra, Terragni Consulting's AI assistant.

CRITICAL RULES:
1. ONLY answer questions about Terragni Consulting, behavioural friction, dark patterns, EAS reports, Sensemaking, FMC Model, Thinking page, People Engagement Team, or Terragni's services.
2. For off‑topic questions (politics, sports, swimming, cooking), politely decline.
3. Use bullet points (•) not tables.
4. Be warm, friendly, and use emojis occasionally 😊.
5. For report questions (EAS 2018, 2023, 2026): Use the **simple, friction‑first summaries** in the knowledge base. Explain what friction was found, where it happened, why it matters. Keep the language very easy to understand. Do not lead with scores or metrics.
6. For "What does Terragni Consulting do?": Give a **complete, detailed answer** – explain the problem (behavioural friction), the 4‑step approach (Sensemaking → FMC Model → Intervention Design), and the measurement tool EAS.
7. For types of friction, list the 7 types plus physical/time friction with examples.
8. Use the knowledge base below for ALL answers.
9. **IMPORTANT:** At the end of every response, append the following footer exactly as shown (do not add extra bullets or spaces): {FOOTER}

KNOWLEDGE BASE:
{KNOWLEDGE_BASE}

Remember: Friction is the mission. EAS is just the measurement tool. Tell the friction story first, in simple words."""


def classify(message):
    m = message.lower().strip()
    greetings = {'hi', 'hello', 'hey', 'hii', 'namaste', 'good morning', 'good evening'}
    thanks = ['thanks', 'thank you', 'thx', 'ty']
    off_topic = ['prime minister', 'modi', 'politics', 'swim', 'cook', 'cricket', 'football', 'movie', 'song']

    if m in greetings:
        return 'greeting'
    if any(t in m for t in thanks):
        return 'thanks'
    for word in off_topic:
        if word in m:
            return 'off_topic'
    return 'terragni'


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    if not data or "messages" not in data:
        return jsonify({"error": "Missing messages"}), 400

    messages = data["messages"]
    user_question = messages[-1]["content"].strip() if messages else ""

    print(f"\n📝 User: {user_question}")

    q_lower = user_question.lower().strip()
    friction_phrases = [
        'types of friction', 'type of friction', 'friction types',
        'what are the types of friction', 'different types of friction',
        'what are the different types of friction'
    ]
    if any(phrase in q_lower for phrase in friction_phrases) or (q_lower.startswith('types') and 'friction' in q_lower):
        friction_answer = """**The Different Types of Friction** 🔍

Behavioural friction has **7 main types**, plus physical and time friction:

• **Cognitive Friction** 🧠 – Complexity, confusion. Example: 50 insurance plans with no idea which is right.

• **Emotional Friction** 💔 – Fear, distrust. Example: Worrying if a health claim will be approved.

• **Social Friction** 👥 – Norms, status risk. Example: Not wanting to be first to try a new system.

• **Identity‑based Friction** 🪪 – "Not for people like me". Example: "Mutual funds are for rich people."

• **Habitual Friction** 🔄 – Old routines overpowering new intent. Example: Still going to the branch out of habit.

• **Motivational Friction** 🎯 – Weak relevance or reward. Example: Effort not worth the benefit.

• **Operational Friction** ⚙️ – Effort, delays. Example: Uploading the same document 3 times.

• **Physical Friction** 🚶 – Number of actions and iterations to get things done.

• **Time Friction** ⏰ – Time taken for things we want done.

Want me to explain any specific type in detail? 😊"""
        return jsonify({"reply": friction_answer + FOOTER})

    msg_type = classify(user_question)

    if msg_type == 'greeting':
        reply = """Hey there! 👋 I'm Terra, Terragni Consulting's AI assistant!

**I can help you with:**
• What Terragni does – detailed explanation (problem, 4‑step process, measurement tool EAS)
• Sensemaking – "We do not start with solutions"
• The FMC Model – Friction, Motivation, Context
• People Engagement Team – employee experience and engagement
• Thinking page – Articles, SHIFT Newsletter, Research, LinkedIn insights
• Dark patterns – real examples from EAS 2026
• Behavioural friction – all 7 types
• EAS reports (2018, 2023, 2026) – told as simple friction stories

**Try asking:**
• "What does Terragni Consulting do?"
• "What is the People Engagement Team?"
• "What did the 2026 report find about personal lending?"
• "Summarise the 2023 report in plain English"
• "What are the different types of friction?" """
        return jsonify({"reply": reply + FOOTER})

    if msg_type == 'thanks':
        return jsonify({"reply": "You're very welcome! 😊 Anything else I can help with? 💫" + FOOTER})

    if msg_type == 'off_topic':
        reply = """I'm Terra, Terragni Consulting's AI assistant. 😊

I can ONLY answer questions about Terragni Consulting, behavioural friction, dark patterns, EAS reports, and our services.

Please ask me something related to Terragni Consulting! 💫"""
        return jsonify({"reply": reply + FOOTER})

    # Build messages for Groq API
    api_messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_question}
    ]

    try:
        print("Calling Groq API...")
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": MODEL,
                "messages": api_messages,
                "max_tokens": 1500,
                "temperature": 0.7
            },
            timeout=60
        )

        if response.status_code == 200:
            result = response.json()
            reply = result["choices"][0]["message"]["content"]
            print("✅ Groq API success")
            if not reply.endswith(FOOTER):
                reply = reply + FOOTER
            return jsonify({"reply": reply})
        else:
            print(f"❌ Groq error: {response.status_code} - {response.text}")
            return jsonify({"reply": "I'm having trouble connecting. Please try again! 😊" + FOOTER})

    except Exception as e:
        print(f"❌ Exception: {e}")
        return jsonify({"reply": "Sorry, I encountered an error. Please try again! 😊" + FOOTER})


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "Terragni Chatbot", "version": "32.0"})


# ✅ Railway-compatible startup
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Railway injects PORT automatically
    print("=" * 65)
    print("🤖 TERRAGNI CHATBOT v32.0")
    print("=" * 65)
    print(f"📍 Server starting on port {port}")
    print("=" * 65)
    app.run(debug=False, port=port, host='0.0.0.0', threaded=True)
