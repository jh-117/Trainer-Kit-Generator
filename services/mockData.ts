import { GeneratedKit } from '../types';

// Template configurations for different topics
const TOPIC_TEMPLATES: Record<string, any> = {
  'Cybersecurity': {
    themes: ['threat detection', 'incident response', 'security protocols', 'phishing awareness'],
    visualKeywords: ['digital security', 'network protection', 'data encryption', 'cyber defense'],
    activities: ['threat simulation', 'security audit', 'password strength testing', 'phishing email identification']
  },
  'Agile': {
    themes: ['sprint planning', 'daily standups', 'retrospectives', 'backlog refinement'],
    visualKeywords: ['team collaboration', 'kanban board', 'scrum meeting', 'agile workspace'],
    activities: ['sprint poker', 'retrospective exercise', 'user story mapping', 'velocity tracking']
  },
  'Leadership': {
    themes: ['emotional intelligence', 'conflict resolution', 'delegation', 'motivation'],
    visualKeywords: ['team leadership', 'executive coaching', 'management meeting', 'professional development'],
    activities: ['leadership assessment', 'role-playing scenarios', '360 feedback', 'goal-setting workshop']
  },
  'Diversity': {
    themes: ['unconscious bias', 'inclusive language', 'cultural competence', 'equity practices'],
    visualKeywords: ['diverse team', 'inclusive workplace', 'multicultural group', 'equality concept'],
    activities: ['bias recognition', 'inclusive dialogue', 'perspective-taking', 'ally skills practice']
  }
};

// Industry-specific customizations
const INDUSTRY_CONTEXTS: Record<string, any> = {
  'Technology': {
    examples: ['software deployment', 'API integration', 'cloud infrastructure', 'DevOps pipeline'],
    challenges: ['rapid innovation', 'technical debt', 'scalability', 'security vulnerabilities']
  },
  'Healthcare': {
    examples: ['patient safety', 'HIPAA compliance', 'clinical protocols', 'electronic health records'],
    challenges: ['regulatory changes', 'patient confidentiality', 'staff burnout', 'medical errors']
  },
  'Finance': {
    examples: ['risk assessment', 'compliance audits', 'financial modeling', 'fraud detection'],
    challenges: ['market volatility', 'regulatory compliance', 'cybersecurity threats', 'customer trust']
  },
  'Manufacturing': {
    examples: ['lean production', 'quality control', 'supply chain', 'equipment maintenance'],
    challenges: ['operational efficiency', 'workplace safety', 'inventory management', 'process optimization']
  }
};

// Generate varied content based on topic and industry
export const getPreGeneratedKit = (industry: string, topic: string): GeneratedKit => {
  // Get topic-specific data or use defaults
  const topicData = Object.keys(TOPIC_TEMPLATES).find(key => 
    topic.toLowerCase().includes(key.toLowerCase())
  );
  const template = topicData ? TOPIC_TEMPLATES[topicData] : {
    themes: ['fundamentals', 'best practices', 'implementation', 'evaluation'],
    visualKeywords: ['business concept', 'professional training', 'corporate learning'],
    activities: ['group discussion', 'case study analysis', 'practical exercise']
  };

  // Get industry-specific data or use defaults
  const industryContext = INDUSTRY_CONTEXTS[industry] || {
    examples: ['workflow optimization', 'team collaboration', 'process improvement'],
    challenges: ['efficiency', 'quality', 'communication', 'innovation']
  };

  // Generate unique slide content
  const slides = [
    {
      title: `${topic} in ${industry}: Welcome & Overview`,
      content: [
        `Tailored training for ${industry} professionals`,
        `Industry-specific challenges: ${industryContext.challenges[0]} and ${industryContext.challenges[1]}`,
        `Real-world applications in your daily work`,
        `Expected outcomes and measurable goals`
      ],
      speakerNotes: `Start with a brief poll: "How many of you have experienced ${industryContext.challenges[0]} in the past month?" Use this to gauge experience level and adjust delivery accordingly.`,
      visualSearchTerm: `${industry} ${template.visualKeywords[0]} professional setting`
    },
    {
      title: `Understanding ${template.themes[0]}`,
      content: [
        `Core principles and framework`,
        `Industry example: ${industryContext.examples[0]}`,
        `Common misconceptions debunked`,
        `The ROI of proper implementation`
      ],
      speakerNotes: `Use the whiteboard to map out the framework. Ask participants to share their current approaches - this creates engagement and reveals knowledge gaps.`,
      visualSearchTerm: `${template.visualKeywords[1]} concept diagram blueprint`
    },
    {
      title: `Practical Application: ${template.themes[1]}`,
      content: [
        `Step-by-step methodology`,
        `${industry} case study walkthrough`,
        `Tools and resources available`,
        `Checkpoint: Quick knowledge check`
      ],
      speakerNotes: `Split into groups of 3-4. Assign each group a mini scenario from the handout. Give them 10 minutes to develop a solution using the methodology just presented.`,
      visualSearchTerm: `${industry} team working ${template.visualKeywords[2]}`
    },
    {
      title: `Advanced Topics: ${template.themes[2]}`,
      content: [
        `Scaling beyond the basics`,
        `Handling exception scenarios`,
        `Integration with existing ${industryContext.examples[1]}`,
        `Measuring success metrics`
      ],
      speakerNotes: `This is where experienced participants shine. Encourage them to share their "war stories" - real challenges they've faced and overcome.`,
      visualSearchTerm: `${template.visualKeywords[3]} advanced technology innovation`
    },
    {
      title: `Interactive Activity: ${template.activities[0]}`,
      content: [
        `Hands-on practice session`,
        `Work on realistic ${industry} scenario`,
        `Peer feedback and discussion`,
        `Identify gaps and next steps`
      ],
      speakerNotes: `Monitor the room closely during this activity. Look for struggling participants and offer guidance. This is the most valuable part of the training.`,
      visualSearchTerm: `diverse team ${template.activities[0]} workshop collaboration`
    },
    {
      title: `Action Planning & Next Steps`,
      content: [
        `Key takeaways summary`,
        `30-60-90 day implementation plan`,
        `Resources: Internal wiki, mentorship program`,
        `Q&A and closing thoughts`
      ],
      speakerNotes: `End with the "one thing" exercise: Everyone commits to one specific action they'll take this week. Have them write it down and share with a partner for accountability.`,
      visualSearchTerm: `success achievement goal planning roadmap`
    }
  ];

  // Generate varied flashcards
  const flashcards = [
    {
      front: `What is the primary benefit of ${topic} in ${industry}?`,
      back: `Improved ${industryContext.challenges[2]}, leading to better ${industryContext.examples[2]} and overall organizational efficiency.`
    },
    {
      front: `Name two key ${template.themes[0]} principles`,
      back: `1) Continuous improvement through feedback loops\n2) Data-driven decision making based on measurable outcomes`
    },
    {
      front: `Common mistake when implementing ${topic}`,
      back: `Skipping the planning phase and jumping straight to execution without stakeholder buy-in or proper resource allocation.`
    },
    {
      front: `How to measure success in ${industry}?`,
      back: `Track KPIs like: reduction in ${industryContext.challenges[0]}, improved ${industryContext.examples[0]} efficiency, and employee satisfaction scores.`
    },
    {
      front: `Best practice for ${template.themes[1]}`,
      back: `Start with a pilot program in one department, gather feedback, iterate, then scale organization-wide with documented lessons learned.`
    }
  ];

  const facilitatorGuideMarkdown = `
# Facilitator Guide: ${topic} for ${industry}

## Course Overview
**Industry:** ${industry}  
**Topic:** ${topic}  
**Duration:** 90 Minutes  
**Audience:** Mid to senior-level professionals  
**Prerequisites:** Basic understanding of ${industryContext.examples[0]}

## Learning Objectives
By the end of this session, participants will:
1. Understand the core principles of ${topic} as applied to ${industry}
2. Identify at least 3 opportunities to apply these concepts in their work
3. Create a personal action plan for implementation

## Pre-Session Setup (30 min before)
- [ ] Test all AV equipment
- [ ] Print handouts (1 per participant + 2 extras)
- [ ] Set up breakout groups (3-4 people each)
- [ ] Prepare ${template.activities[0]} materials
- [ ] Queue up case study video (if using)

## Detailed Delivery Timeline

### 00-10 min: Opening & Icebreaker
**Goal:** Build rapport and assess baseline knowledge

- Welcome and introductions
- **Icebreaker:** "Share one ${industryContext.challenges[0]} challenge you've faced this month"
- Set ground rules (phones away, active participation)
- Preview agenda

**Facilitation Tip:** Use a parking lot (flip chart) for off-topic questions that arise.

### 10-25 min: Foundation & Theory (Slides 1-2)
**Goal:** Establish shared understanding of core concepts

- Present fundamental principles
- Use ${industry}-specific examples
- **Interactive poll:** "Have you tried this before?" (show of hands)
- Address common misconceptions

**Watch for:** Participants who look confused. Check in during breaks.

### 25-45 min: Practical Application (Slides 3-4)
**Goal:** Bridge theory to practice

- Walk through case study from ${industry}
- **Group Activity:** Small groups solve a mini-scenario (15 min)
- Groups share solutions (2 min each)
- Instructor synthesizes key patterns

**Pacing Note:** This tends to run long. Keep groups on time.

### 45-70 min: Hands-On Practice (Slide 5)
**Goal:** Experiential learning through ${template.activities[0]}

- Explain the ${template.activities[0]} exercise
- Participants work individually or in pairs
- Circulate the room, provide coaching
- Debrief as a group: "What surprised you?"

**Common Issues:** 
- Some participants may finish early - have an advanced challenge ready
- Others may struggle - pair them with a faster learner

### 70-85 min: Action Planning (Slide 6)
**Goal:** Ensure transfer of learning

- Distribute action plan template
- Participants write their "one thing" commitment
- **Pair & Share:** Exchange plans with neighbor
- Set follow-up accountability (optional)

### 85-90 min: Closing
- Answer final questions
- Share additional resources
- Distribute evaluation survey
- Thank participants

## Dealing with Difficult Situations

**If a participant dominates discussion:**  
"Thanks for that input, [Name]. Let's hear from someone who hasn't shared yet."

**If energy drops after lunch:**  
Do a 2-minute standing stretch or energizer activity.

**If you're running behind:**  
Skip the video or shorten the final Q&A. Never rush the hands-on activity.

## Post-Session Follow-Up
- [ ] Send summary email within 24 hours
- [ ] Share slide deck and resources
- [ ] Schedule optional office hours for questions
- [ ] Collect and review evaluation feedback

## Resources for Facilitators
- **Internal:** ${industry} Knowledge Base (link)
- **External:** Industry standards and guidelines
- **Support:** Training team Slack channel

---
*Version 1.2 | Last Updated: ${new Date().toLocaleDateString()} | Confidential*
`;

  const handoutMarkdown = `
# ${topic} in ${industry}: Participant Workbook

## Session Overview
**Today's Focus:** Practical application of ${topic} principles in ${industry} environments.

## Learning Objectives
✓ Understand core ${topic} concepts  
✓ Apply best practices to real ${industry} scenarios  
✓ Create a personal implementation roadmap  

---

## Part 1: Key Concepts

### The ${topic} Framework
${topic} in ${industry} is built on three pillars:

1. **${template.themes[0]}**  
   - Focus on ${industryContext.examples[0]}
   - Continuous improvement mindset
   - Data-driven decisions

2. **${template.themes[1]}**  
   - Integration with ${industryContext.examples[1]}
   - Stakeholder alignment
   - Risk mitigation strategies

3. **${template.themes[2]}**  
   - Scalable processes
   - Change management
   - Sustainability planning

### Why This Matters in ${industry}
- **Challenge:** ${industryContext.challenges[0]}  
  **Solution:** Systematic approach to ${template.themes[0]}

- **Challenge:** ${industryContext.challenges[1]}  
  **Solution:** ${template.themes[1]} methodology

- **Challenge:** ${industryContext.challenges[2]}  
  **Solution:** Proactive ${template.themes[2]}

---

## Part 2: Case Study Analysis

### Scenario: ${industry} Company X
Company X faced significant ${industryContext.challenges[0]} issues. They implemented ${topic} principles and saw:
- 40% reduction in ${industryContext.challenges[1]}
- Improved ${industryContext.examples[2]} efficiency
- Higher employee satisfaction

**Your Task:** Analyze what made this successful.

**Discussion Questions:**
1. What were the key success factors?
2. What obstacles did they likely face?
3. How could this apply to your organization?

**Notes:**
_____________________________________________________________________
_____________________________________________________________________
_____________________________________________________________________

---

## Part 3: Hands-On Activity

### ${template.activities[0]} Exercise
**Instructions:**
1. Review the scenario provided
2. Apply the ${topic} framework
3. Document your approach
4. Share with your group

**Scenario:**
Your ${industry} team is experiencing ${industryContext.challenges[0]}. You have been asked to propose a solution using ${topic} principles.

**Your Solution:**
_____________________________________________________________________
_____________________________________________________________________
_____________________________________________________________________
_____________________________________________________________________

**Key Steps:**
□ ____________________________________________________________
□ ____________________________________________________________
□ ____________________________________________________________

---

## Part 4: Personal Action Plan

### My 30-60-90 Day Plan

**Week 1-4 (Foundation):**
One thing I will do:
_____________________________________________________________________

Success metric:
_____________________________________________________________________

**Week 5-8 (Build):**
One thing I will do:
_____________________________________________________________________

Success metric:
_____________________________________________________________________

**Week 9-12 (Scale):**
One thing I will do:
_____________________________________________________________________

Success metric:
_____________________________________________________________________

### Accountability Partner
Name: _________________________ Email: _________________________

---

## Quick Reference Guide

### Do's
✓ Start small and iterate
✓ Gather feedback early
✓ Document lessons learned
✓ Celebrate quick wins

### Don'ts
✗ Skip stakeholder alignment
✗ Ignore existing processes
✗ Expect perfection immediately
✗ Work in silos

---

## Additional Resources

### Internal
- ${industry} Wiki: [link]
- Best Practices Database
- Mentorship Program
- Monthly Community of Practice calls

### External
- Industry Association guidelines
- Online training modules
- Recommended reading list
- Professional certification paths

### Support
- Questions? Email: training@company.com
- Office Hours: Every Friday 2-3 PM
- Slack Channel: #${topic.toLowerCase().replace(/\s+/g, '-')}

---

**Keep This Workbook!**  
Refer back to it as you implement ${topic} in your daily work.

*© ${new Date().getFullYear()} | ${industry} Training Series | Confidential*
`;

  const backgroundImagePrompt = `${industry} ${topic} ${template.visualKeywords[0]} professional corporate modern`;

  return {
    slides,
    flashcards,
    facilitatorGuideMarkdown,
    handoutMarkdown,
    backgroundImagePrompt
  };
};