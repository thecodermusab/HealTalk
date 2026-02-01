export interface Author {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  linkedinUrl: string;
  socialLabel?: string;
}

export interface BlogPostContent {
  type: 'paragraph' | 'heading' | 'list' | 'quote';
  value: string | string[];
}

export interface BlogPost {
  id: string;
  title: string;
  subtitle?: string; // Added subtitle
  excerpt: string;
  imageUrl: string; // Used for listing and as default hero photo
  category?: string;
  author: string | Author; // Updated to support detailed author object
  date: string;
  heroType?: 'illustration' | 'photo'; // Added hero type
  heroIllustration?: string;
  content?: BlogPostContent[]; // Added content blocks
  theme?: 'lilac' | 'green' | 'cream';
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "How to Know When It's Time to See a Therapist",
    subtitle: "You don't need to wait until things feel impossible. Learn the clear signs that it might be time to reach out for professional help.",
    excerpt: "Many people wonder when they should talk to a therapist. The truth is, you don't need to wait until things feel impossible.",
    imageUrl: "/images/Blog1.png",
    category: "Mental Health",
    date: "Jan 28, 2026",
    heroType: "photo",
    theme: "green",
    author: {
      name: "Musab Mohamed Ali",
      role: "CEO / Partner",
      bio: "Musab Mohamed Ali is the CEO and Partner at HealTalk, dedicated to making mental health support accessible and stigma-free for everyone.",
      imageUrl: "/images/Me.png",
      linkedinUrl: "https://www.instagram.com/maahir.03?igsh=anY3cXUzanhwNTNj&utm_source=qr",
      socialLabel: "Instagram"
    },
    content: [
      { type: 'paragraph', value: "Many people wonder when they should talk to a therapist. The truth is, you don't need to wait until things feel impossible. Therapy isn't just for people in crisis—it's a helpful tool for anyone who wants to feel better and live a healthier life. Here are some clear signs that it might be time to reach out for professional help." },

      { type: 'heading', value: "You Feel Stuck in the Same Patterns" },
      { type: 'paragraph', value: "If you've been facing the same problems for weeks or months without any improvement, therapy can help you break free. Maybe you keep having the same arguments with your partner, repeating the same mistakes at work, or you can't shake feelings of sadness no matter what you try. When you feel like you're going in circles, a therapist can give you new perspectives and practical tools to handle these situations differently." },
      { type: 'paragraph', value: "Sometimes we get so close to our own problems that we can't see the way out. A therapist offers an outside view and can help you identify patterns you might not notice on your own." },

      { type: 'heading', value: "Daily Life Feels Overwhelming" },
      { type: 'paragraph', value: "When simple, everyday tasks start feeling like mountains to climb, that's an important signal. If getting out of bed feels exhausting, going to work seems impossible, or spending time with friends takes too much energy, these are signs worth paying attention to." },
      { type: 'paragraph', value: "You might find yourself avoiding activities you used to enjoy, struggling to concentrate on basic tasks, or feeling like everything requires more effort than it should. These feelings can slowly build up until normal life feels unmanageable. Therapy can help you understand what's happening and give you strategies to regain your energy and motivation." },

      { type: 'heading', value: "Your Emotions Feel Out of Control" },
      { type: 'paragraph', value: "Everyone experiences sadness, anger, anxiety, or frustration—these are normal human emotions. But if these feelings are very intense, last for a long time, or happen without clear reasons, it might be time to talk to someone professional." },
      { type: 'paragraph', value: "Are you crying more than usual? Do you have angry outbursts that surprise even you? Do you feel anxious or worried constantly, even about small things? When emotions start controlling your life instead of being a natural part of it, a therapist can help you understand where these feelings come from and how to manage them in healthy ways." },

      { type: 'heading', value: "Your Relationships Are Suffering" },
      { type: 'paragraph', value: "Our mental health affects how we connect with others. If you notice that you're constantly arguing with loved ones, pushing people away, or feeling isolated even when you're around others, therapy can help." },
      { type: 'paragraph', value: "Maybe you're having trouble trusting people, communicating your needs, or maintaining friendships. A therapist can help you develop better relationship skills and understand why you might be struggling to connect with the people who matter to you." },

      { type: 'heading', value: "People Around You Have Expressed Concern" },
      { type: 'paragraph', value: "Sometimes the people who care about us notice changes in our behavior before we fully recognize them ourselves. If friends, family members, or coworkers have mentioned they're worried about you, it's worth taking their concerns seriously." },
      { type: 'paragraph', value: "They might have noticed you seem more withdrawn, irritable, or different than usual. While only you know how you truly feel inside, listening to the observations of people who know you well can provide valuable insight." },

      { type: 'heading', value: "You're Using Unhealthy Ways to Cope" },
      { type: 'paragraph', value: "When life gets difficult, we all look for ways to feel better. But some coping methods create more problems than they solve. Drinking too much alcohol, using drugs, overeating, sleeping too much, or completely avoiding your responsibilities are signs that you need healthier strategies." },
      { type: 'paragraph', value: "These behaviors often start as temporary relief but can quickly become harmful patterns. A therapist can help you understand what you're really trying to escape from and teach you better ways to handle stress and difficult emotions." },

      { type: 'heading', value: "You've Experienced Something Traumatic" },
      { type: 'paragraph', value: "Major life events—like the death of a loved one, a serious accident, abuse, divorce, or losing a job—can affect us deeply. Even if the event happened months or years ago, unprocessed trauma can continue impacting your mental health." },
      { type: 'paragraph', value: "You don't need to \"get over it\" on your own. Therapists are trained to help people work through traumatic experiences in safe and effective ways." },

      { type: 'heading', value: "The Bottom Line" },
      { type: 'paragraph', value: "You don't need to be in crisis to see a therapist. Think of therapy like going to the doctor for a regular check-up or going to the gym to stay healthy. It's about taking care of yourself before small problems become big ones." },
      { type: 'paragraph', value: "If you're reading this and wondering whether therapy might help you, that question itself is often a good enough reason to try. Taking the first step toward getting help is a sign of strength, not weakness. Your mental health matters, and you deserve support." }
    ]
  },
  {
    id: "2",
    title: "Understanding Anxiety: What's Normal and What's Not",
    subtitle: "Everyone feels anxious sometimes, but how do you know when anxiety becomes a problem that needs professional help?",
    excerpt: "Everyone feels anxious sometimes, but how do you know when anxiety becomes a problem that needs professional help?",
    imageUrl: "/images/Blog2.png",
    category: "Mental Health",
    date: "Jan 25, 2026",
    heroType: "photo",
    theme: "green",
    author: {
      name: "Musab Mohamed Ali",
      role: "CEO / Partner",
      bio: "Musab Mohamed Ali is the CEO and Partner at HealTalk, dedicated to making mental health support accessible and stigma-free for everyone.",
      imageUrl: "/images/Me.png",
      linkedinUrl: "https://www.instagram.com/maahir.03?igsh=anY3cXUzanhwNTNj&utm_source=qr",
      socialLabel: "Instagram"
    },
    content: [
      { type: 'paragraph', value: "Anxiety is one of the most common human emotions. Everyone experiences it at some point—before a big presentation, when meeting new people, or when facing important decisions. But sometimes, anxiety can grow beyond these normal moments and start affecting your daily life. Understanding the difference between normal anxiety and an anxiety disorder can help you decide if you need professional support." },

      { type: 'heading', value: "What Is Normal Anxiety?" },
      { type: 'paragraph', value: "Normal anxiety is your body's natural response to stress or danger. It's actually helpful in many situations. When you feel anxious before a test, your body is preparing you to focus and perform well. When you feel nervous about a job interview, that's your mind helping you prepare and stay alert." },
      { type: 'paragraph', value: "Normal anxiety usually has these features: it's connected to a specific event or situation, it goes away when the stressful situation ends, it doesn't stop you from doing everyday activities, and it's proportional to the actual situation. For example, feeling worried the night before surgery makes sense. Feeling terrified about going to the grocery store usually doesn't." },

      { type: 'heading', value: "When Does Anxiety Become a Problem?" },
      { type: 'paragraph', value: "Anxiety becomes a concern when it starts interfering with your life. This happens when the anxiety is too intense for the situation, lasts much longer than it should, or occurs without any clear reason. Problem anxiety doesn't just go away when the stressful event passes—it lingers and affects other parts of your life." },
      { type: 'paragraph', value: "You might have an anxiety disorder if you constantly worry about many different things, even small ones. You might feel restless or on edge most days. Physical symptoms like a racing heart, sweating, shaking, or stomach problems might appear regularly. You might avoid places, people, or situations because they make you anxious. Sleep might become difficult because your mind won't stop racing with worries." },

      { type: 'heading', value: "Common Signs of Anxiety Disorders" },
      { type: 'paragraph', value: "Anxiety disorders can show up in different ways. Some people experience panic attacks—sudden waves of intense fear that come with physical symptoms like difficulty breathing, chest pain, or feeling like you're losing control. These attacks can be so scary that people start avoiding situations where they've happened before." },
      { type: 'paragraph', value: "Social anxiety makes ordinary social situations feel overwhelming. You might worry excessively about being judged or embarrassed in front of others. This can lead to avoiding social events, which then makes you feel isolated and lonely." },
      { type: 'paragraph', value: "Generalized anxiety disorder means you worry about everything—your health, your family, your work, your finances—even when there's no real reason to worry. The worry feels impossible to control and takes up much of your mental energy every day." },

      { type: 'heading', value: "Physical Symptoms You Shouldn't Ignore" },
      { type: 'paragraph', value: "Anxiety isn't just in your head—it affects your whole body. Chronic anxiety can cause headaches, muscle tension, digestive problems, fatigue, and difficulty concentrating. Some people experience dizziness, numbness, or tingling. These physical symptoms are real and can be just as distressing as the worried thoughts themselves." },
      { type: 'paragraph', value: "If you frequently experience these physical symptoms along with constant worrying, it's worth talking to a healthcare provider. Sometimes medical conditions can cause anxiety-like symptoms, so it's important to rule those out." },

      { type: 'heading', value: "When Should You Seek Help?" },
      { type: 'paragraph', value: "You don't need to wait until anxiety becomes unbearable to get help. Consider reaching out to a mental health professional if your anxiety lasts for several weeks or months, if it's getting worse over time, if it's affecting your relationships or work performance, or if you're using alcohol, drugs, or other unhealthy behaviors to cope with anxious feelings." },
      { type: 'paragraph', value: "Also seek help if you're avoiding more and more situations because of anxiety, if you're having panic attacks, or if anxiety is making you feel hopeless or depressed." },

      { type: 'heading', value: "The Good News" },
      { type: 'paragraph', value: "Anxiety disorders are highly treatable. Therapy, particularly cognitive behavioral therapy, has been proven very effective in helping people manage anxiety. Some people also benefit from medication. The most important step is recognizing that your anxiety has become a problem and reaching out for support." },
      { type: 'paragraph', value: "Remember, seeking help for anxiety isn't a sign of weakness—it's a smart decision to improve your quality of life. Just like you'd see a doctor for a physical health problem, seeing a therapist for anxiety makes perfect sense. You don't have to struggle alone." }
    ]
  },
  {
    id: "3",
    title: "What to Expect in Your First Therapy Session",
    subtitle: "Walking into your first therapy session can feel scary. Here's what will actually happen so you can feel more prepared and confident.",
    excerpt: "Walking into your first therapy session can feel scary. Here's what will actually happen so you can feel more prepared and confident.",
    imageUrl: "/images/Blog3.png",
    category: "Mental Health",
    date: "Jan 20, 2026",
    heroType: "photo",
    theme: "green",
    author: {
      name: "Musab Mohamed Ali",
      role: "CEO / Partner",
      bio: "Musab Mohamed Ali is the CEO and Partner at HealTalk, dedicated to making mental health support accessible and stigma-free for everyone.",
      imageUrl: "/images/Me.png",
      linkedinUrl: "https://www.instagram.com/maahir.03?igsh=anY3cXUzanhwNTNj&utm_source=qr",
      socialLabel: "Instagram"
    },
    content: [
      { type: 'paragraph', value: "Starting therapy is a big step, and it's completely normal to feel nervous about your first session. You might wonder what you're supposed to say, whether you'll be judged, or if therapy will actually help. The truth is, your therapist has seen hundreds of first sessions, and they understand exactly how you're feeling. Here's what you can expect so you can walk in feeling more prepared and less anxious." },

      { type: 'heading', value: "Before You Arrive" },
      { type: 'paragraph', value: "Most therapists will ask you to fill out some paperwork before your first session. This usually includes basic information about your health history, current symptoms, and what brings you to therapy. Some therapists send these forms online, while others have you arrive early to complete them in the waiting room." },
      { type: 'paragraph', value: "You'll also discuss practical matters like session fees, insurance, cancellation policies, and confidentiality. Your therapist will explain that what you share in sessions is private, with only a few exceptions related to safety. Knowing these details upfront helps you feel more secure." },

      { type: 'heading', value: "The First Few Minutes" },
      { type: 'paragraph', value: "When you first meet your therapist, they'll usually start with casual conversation to help you feel comfortable. They might offer you water or tea, show you where to sit, and explain how the session will work. This isn't wasted time—it's the therapist helping you ease into the experience." },
      { type: 'paragraph', value: "Your therapist will likely explain their approach to therapy and what you can expect from working together. They might describe their training, their specialties, and how they typically structure sessions. Don't hesitate to ask questions if anything is unclear." },

      { type: 'heading', value: "What You'll Talk About" },
      { type: 'paragraph', value: "The main part of your first session focuses on understanding why you're there and what you hope to achieve. Your therapist will ask about what's been troubling you, how long it's been happening, and how it affects your daily life. They're not trying to pry—they're gathering information to help you effectively." },
      { type: 'paragraph', value: "You might talk about your current situation, your relationships, your work or school, your family background, and any previous experiences with therapy or medication. Your therapist may ask about your physical health, sleep patterns, eating habits, and whether you use alcohol or drugs. These questions help them see the complete picture of your wellbeing." },

      { type: 'heading', value: "You Don't Have to Share Everything" },
      { type: 'paragraph', value: "It's important to know that you're in control of what you share. If a question feels too personal or you're not ready to talk about something, you can say so. A good therapist will respect your boundaries and won't push you to discuss things before you're ready." },
      { type: 'paragraph', value: "Some people worry that they'll cry in therapy or show too much emotion. But therapy is exactly the place where it's safe to express your feelings. Your therapist won't judge you for crying, getting angry, or showing vulnerability—that's what they're there to support." },

      { type: 'heading', value: "Setting Goals Together" },
      { type: 'paragraph', value: "Toward the end of the first session, your therapist will often talk with you about your goals for therapy. What do you want to be different in your life? How will you know when therapy is helping? These goals help guide your work together and give you markers to measure progress." },
      { type: 'paragraph', value: "Your therapist might also suggest a treatment approach or explain how they plan to help you. They may recommend how often you should meet—weekly is common, though some people need more or less frequent sessions." },

      { type: 'heading', value: "After the Session" },
      { type: 'paragraph', value: "After your first session, take a moment to notice how you feel. Do you feel heard? Do you think you can trust this therapist? It's okay if you're not completely sure yet—it often takes a few sessions to really know if it's a good fit." },
      { type: 'paragraph', value: "Some people feel relieved after their first session, while others feel emotionally drained or vulnerable. Both reactions are normal. You've just started opening up about difficult topics, which takes courage and energy." },

      { type: 'heading', value: "What If It Doesn't Feel Right?" },
      { type: 'paragraph', value: "Not every therapist is the right match for every person. If after a few sessions you don't feel comfortable or don't think the therapist understands you, it's perfectly acceptable to try someone else. A good therapist will understand this and may even help you find a better fit." },

      { type: 'heading', value: "Remember This" },
      { type: 'paragraph', value: "Your first therapy session is the beginning of a process, not a one-time fix. You don't need to solve all your problems in the first hour. You don't need to have everything figured out or explain your entire life story. Just show up honestly and be willing to participate in the process." },
      { type: 'paragraph', value: "Most people leave their first session feeling hopeful, even if they also feel nervous or uncertain. You've taken an important step toward better mental health, and that deserves recognition. The hardest part is often just walking through the door—and you're already doing that." }
    ]
  },
  {
    id: "4",
    title: "Radia",
    excerpt: "Content coming soon.",
    imageUrl: "/images/ciro.png",
    category: "Mental Health",
    date: "Jan 18, 2026",
    heroType: "photo",
    author: {
      name: "Radia Ahmed Abdirahman",
      role: "Head of Care Operations",
      bio: "Radia Ahmed is a licensed therapist specializing in depression, family dynamics, and relationship counseling.",
      imageUrl: "/images/ciro.png",
      linkedinUrl: "#"
    },
  },
  {
    id: "5",
    title: "Radia",
    excerpt: "Content coming soon.",
    imageUrl: "/images/ciro.png",
    category: "Mental Health",
    date: "Jan 15, 2026",
    heroType: "photo",
    author: {
      name: "Radia Ahmed Abdirahman",
      role: "Head of Care Operations",
      bio: "Radia Ahmed is a licensed therapist specializing in depression, family dynamics, and relationship counseling.",
      imageUrl: "/images/ciro.png",
      linkedinUrl: "#"
    },
  },
  {
    id: "6",
    title: "Radia",
    excerpt: "Content coming soon.",
    imageUrl: "/images/ciro.png",
    category: "Mental Health",
    date: "Jan 12, 2026",
    heroType: "photo",
    author: {
      name: "Radia Ahmed Abdirahman",
      role: "Head of Care Operations",
      bio: "Radia Ahmed is a licensed therapist specializing in depression, family dynamics, and relationship counseling.",
      imageUrl: "/images/ciro.png",
      linkedinUrl: "#"
    },
  },
  {
    id: "7",
    title: "Ugbaad",
    excerpt: "Content coming soon.",
    imageUrl: "/images/Mustaf.png",
    category: "Mental Health",
    date: "Jan 10, 2026",
    heroType: "photo",
    author: {
      name: "Ugbad Bashir Barre",
      role: "Client Director",
      bio: "Ugbaad is a mental health counselor focused on stress management, work-life balance, and building emotional resilience.",
      imageUrl: "/images/Mustaf.png",
      linkedinUrl: "#"
    },
  },
  {
    id: "8",
    title: "Ugbaad",
    excerpt: "Content coming soon.",
    imageUrl: "/images/Mustaf.png",
    category: "Mental Health",
    date: "Jan 8, 2026",
    heroType: "photo",
    author: {
      name: "Ugbad Bashir Barre",
      role: "Client Director",
      bio: "Ugbaad is a mental health counselor focused on stress management, work-life balance, and building emotional resilience.",
      imageUrl: "/images/Mustaf.png",
      linkedinUrl: "#"
    },
  },
  {
    id: "9",
    title: "Ugbaad",
    excerpt: "Content coming soon.",
    imageUrl: "/images/Mustaf.png",
    category: "Mental Health",
    date: "Jan 5, 2026",
    heroType: "photo",
    author: {
      name: "Ugbad Bashir Barre",
      role: "Client Director",
      bio: "Ugbaad is a mental health counselor focused on stress management, work-life balance, and building emotional resilience.",
      imageUrl: "/images/Mustaf.png",
      linkedinUrl: "#"
    },
  },
  {
    id: "10",
    title: "Sabiriin",
    excerpt: "Content coming soon.",
    imageUrl: "/images/koonfur.png",
    category: "Mental Health",
    date: "Jan 3, 2026",
    heroType: "photo",
    author: {
      name: "Sabirin Ali Isack",
      role: "Director of Operations",
      bio: "Sabiriin is a mental health professional specializing in holistic wellness and community mental health.",
      imageUrl: "/images/koonfur.png",
      linkedinUrl: "#"
    },
  },
  {
    id: "11",
    title: "Sabiriin",
    excerpt: "Content coming soon.",
    imageUrl: "/images/koonfur.png",
    category: "Mental Health",
    date: "Jan 1, 2026",
    heroType: "photo",
    author: {
      name: "Sabirin Ali Isack",
      role: "Director of Operations",
      bio: "Sabiriin is a mental health professional specializing in holistic wellness and community mental health.",
      imageUrl: "/images/koonfur.png",
      linkedinUrl: "#"
    },
  },
  {
    id: "12",
    title: "Sabiriin",
    excerpt: "Content coming soon.",
    imageUrl: "/images/koonfur.png",
    category: "Mental Health",
    date: "Dec 29, 2025",
    heroType: "photo",
    author: {
      name: "Sabirin Ali Isack",
      role: "Director of Operations",
      bio: "Sabiriin is a mental health professional specializing in holistic wellness and community mental health.",
      imageUrl: "/images/koonfur.png",
      linkedinUrl: "#"
    },
  },
  {
    id: "13",
    title: "Abdulkadir",
    excerpt: "Content coming soon.",
    imageUrl: "/images/koonfur.png",
    category: "Mental Health",
    date: "Dec 27, 2025",
    heroType: "photo",
    author: {
      name: "Abdulkadir Mohamed Abdi",
      role: "Head of People",
      bio: "Abdulkadir is a mental health advocate focused on organizational wellness and employee mental health.",
      imageUrl: "/images/koonfur.png",
      linkedinUrl: "#"
    },
  },
  {
    id: "14",
    title: "Abdulkadir",
    excerpt: "Content coming soon.",
    imageUrl: "/images/koonfur.png",
    category: "Mental Health",
    date: "Dec 25, 2025",
    heroType: "photo",
    author: {
      name: "Abdulkadir Mohamed Abdi",
      role: "Head of People",
      bio: "Abdulkadir is a mental health advocate focused on organizational wellness and employee mental health.",
      imageUrl: "/images/koonfur.png",
      linkedinUrl: "#"
    },
  },
  {
    id: "15",
    title: "Abdulkadir",
    excerpt: "Content coming soon.",
    imageUrl: "/images/koonfur.png",
    category: "Mental Health",
    date: "Dec 23, 2025",
    heroType: "photo",
    author: {
      name: "Abdulkadir Mohamed Abdi",
      role: "Head of People",
      bio: "Abdulkadir is a mental health advocate focused on organizational wellness and employee mental health.",
      imageUrl: "/images/koonfur.png",
      linkedinUrl: "#"
    },
  },
];
