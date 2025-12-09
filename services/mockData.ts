import { GeneratedKit, Slide, Flashcard } from '../types';

export const getPreGeneratedKit = (industry: string, topic: string): GeneratedKit => {
  // Helper to generate consistent content based on topic
  const slides: Slide[] = [
    {
      title: `${topic}: Course Introduction`,
      content: [
        `Welcome to the comprehensive training on ${topic}`,
        `Industry Focus: ${industry}`,
        "Key learning outcomes for this session",
        "Overview of the training roadmap"
      ],
      speakerNotes: "Welcome everyone. Start by introducing yourself and the importance of this topic in our specific industry context. Gauge the room's current knowledge level.",
      visualSearchTerm: `${industry} professional presentation meeting`
    },
    {
      title: "Core Principles & Fundamentals",
      content: [
        "Understanding the basic framework",
        "Why this matters in the current market",
        "Common misconceptions vs. reality",
        "Foundational pillars of success"
      ],
      speakerNotes: "Focus on the 'Why'. Use anecdotes from recent industry events to illustrate why these fundamentals are non-negotiable.",
      visualSearchTerm: "minimalist business concept structure foundation"
    },
    {
      title: "Strategies for Implementation",
      content: [
        "Step-by-step execution guide",
        "Best practices for daily operations",
        "Tools and resources required",
        "Overcoming common barriers"
      ],
      speakerNotes: "Walk through the process diagram. Ask participants to identify where they foresee bottlenecks in their own workflows.",
      visualSearchTerm: "strategic planning chessboard or blueprint"
    },
    {
      title: "Case Study Analysis",
      content: [
        "Real-world scenario application",
        "Analyzing success factors",
        "Lessons learned from failure",
        "Group discussion points"
      ],
      speakerNotes: "Split the group into pairs. Have them discuss the case study provided in the handout and present their findings.",
      visualSearchTerm: "diverse team discussing business documents"
    },
    {
      title: "Summary & Action Plan",
      content: [
        "Recap of key takeaways",
        "Personal commitment to action",
        "Resources for further learning",
        "Q&A Session"
      ],
      speakerNotes: "End on a high note. Ensure everyone leaves with at least one actionable step they can take immediately.",
      visualSearchTerm: "success achievement mountain top or handshake"
    }
  ];

  const flashcards: Flashcard[] = [
    {
      front: "What is the primary goal of this topic?",
      back: `To enhance efficiency and compliance within the ${industry} sector by mastering ${topic}.`
    },
    {
      front: "Key Best Practice #1",
      back: "Always verify data sources and maintain clear communication channels."
    },
    {
      front: "Common Pitfall to Avoid",
      back: "Neglecting the initial planning phase or ignoring stakeholder feedback."
    },
    {
      front: "Implementation Strategy",
      back: "Start small, measure results, and scale gradually."
    },
    {
      front: "Success Metric",
      back: "Reduction in error rates and increase in operational speed."
    }
  ];

  const facilitatorGuideMarkdown = `
# Facilitator Guide: ${topic}

## Course Overview
**Industry:** ${industry}
**Duration:** 60 Minutes
**Audience:** Professionals seeking to upskill in ${topic}.

## Preparation Checklist
- [ ] Review slide deck
- [ ] Print participant handouts
- [ ] Prepare flip chart markers
- [ ] Test AV equipment

## Delivery Timeline

### 00-10 min: Introduction
- Welcome participants
- Icebreaker activity
- Review agenda

### 10-25 min: Core Concepts
- Present slides 2-3
- *Activity:* Group discussion on current challenges.

### 25-45 min: Deep Dive & Application
- Case Study analysis
- Role-playing exercise
- **Key Insight:** Emphasize the importance of context in ${industry}.

### 45-60 min: Conclusion
- Q&A
- Feedback survey
- Distribute "Next Steps" worksheet

## Facilitation Tips
- Encourage quiet participants to share.
- Use real-world examples from ${industry}.
- Keep the energy high during the post-lunch slump.
`;

  const handoutMarkdown = `
# Participant Handout: ${topic}

## Learning Objectives
By the end of this session, you will be able to:
1. Understand the core principles of ${topic}.
2. Apply best practices in a ${industry} context.
3. Identify and mitigate common risks.

## Key Concepts

### The 3 Pillars of Success
1. **Awareness**: Knowing what to look for.
2. **Action**: knowing how to respond.
3. **Adaptability**: Changing course when necessary.

## Activity Worksheet

**Reflection Question:**
How does ${topic} impact your daily role?
_________________________________________________________________________
_________________________________________________________________________

**Action Plan:**
List three steps you will take this week to improve:
1. ________________________________________________________________
2. ________________________________________________________________
3. ________________________________________________________________

## Resources
- Internal Knowledge Base
- Industry Standard Guidelines (ISO/IEC)
- Team Mentorship Program

---
*${industry} Training Series | Confidential*
`;

  // Generate a suitable visual prompt based on the industry and topic
  const backgroundImagePrompt = `${industry} ${topic} professional modern abstract wallpaper`;

  return {
    slides,
    flashcards,
    facilitatorGuideMarkdown,
    handoutMarkdown,
    backgroundImagePrompt
  };
};
