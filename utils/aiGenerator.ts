import { TrainingInput, TrainingPlan, GeneratedKit, Flashcard, Slide } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export async function generateTrainingPlan(input: TrainingInput): Promise<TrainingPlan> {
  let fileContent: string | undefined;

  if (input.file) {
    try {
      fileContent = await readFileAsText(input.file);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  }

  const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-training-plan`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      industry: input.industry,
      topic: input.topic,
      fileContent,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate training plan');
  }

  return await response.json();
}

export async function generateFullKit(plan: TrainingPlan): Promise<GeneratedKit> {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-full-kit`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(plan),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate training kit');
  }

  return await response.json();
}

export function getPreGeneratedKit(industry: string, topic: string): GeneratedKit {
  const templates: Record<string, Record<string, GeneratedKit>> = {
    'Healthcare': {
      'Patient Safety': {
        slides: [
          {
            title: 'Patient Safety Training',
            content: ['Understanding patient safety principles', 'Reducing medical errors', 'Creating a culture of safety'],
            speakerNotes: 'Welcome participants and introduce the critical importance of patient safety in healthcare settings.',
            visualSearchTerm: 'hospital patient care'
          },
          {
            title: 'Key Safety Principles',
            content: ['Communication is essential', 'Documentation saves lives', 'Double-check everything', 'Speak up when concerned'],
            speakerNotes: 'Emphasize that every team member plays a crucial role in patient safety.',
            visualSearchTerm: 'medical team collaboration'
          },
          {
            title: 'Medication Safety',
            content: ['Five Rights of Medication', 'Right Patient, Right Drug', 'Right Dose, Right Route', 'Right Time'],
            speakerNotes: 'Review each of the five rights with real-world examples.',
            visualSearchTerm: 'medication administration'
          },
          {
            title: 'Infection Control',
            content: ['Hand hygiene protocols', 'PPE usage guidelines', 'Environmental cleaning', 'Isolation procedures'],
            speakerNotes: 'Demonstrate proper hand washing and PPE donning/doffing techniques.',
            visualSearchTerm: 'hand washing healthcare'
          },
          {
            title: 'Fall Prevention',
            content: ['Risk assessment tools', 'Environmental modifications', 'Patient education', 'Mobility assistance'],
            speakerNotes: 'Discuss the impact of falls on patient outcomes and healthcare costs.',
            visualSearchTerm: 'elderly patient assistance'
          },
          {
            title: 'Communication Best Practices',
            content: ['SBAR technique', 'Closed-loop communication', 'Handoff protocols', 'Team huddles'],
            speakerNotes: 'Practice SBAR scenarios with the group.',
            visualSearchTerm: 'healthcare team meeting'
          },
          {
            title: 'Error Reporting',
            content: ['Just culture approach', 'Non-punitive reporting', 'Root cause analysis', 'System improvements'],
            speakerNotes: 'Emphasize that reporting errors helps prevent future incidents.',
            visualSearchTerm: 'quality improvement healthcare'
          },
          {
            title: 'Action Plan',
            content: ['Commit to one safety improvement', 'Share learning with team', 'Practice daily safety checks', 'Report concerns promptly'],
            speakerNotes: 'Have each participant identify one specific action they will take.',
            visualSearchTerm: 'healthcare professionals planning'
          }
        ],
        flashcards: [
          { front: 'What are the Five Rights of Medication?', back: 'Right Patient, Right Drug, Right Dose, Right Route, Right Time' },
          { front: 'What does SBAR stand for?', back: 'Situation, Background, Assessment, Recommendation' },
          { front: 'Why is hand hygiene critical?', back: 'It is the single most effective way to prevent healthcare-associated infections' },
          { front: 'What is a just culture?', back: 'An environment where people can report errors without fear of punishment, focusing on system improvement' },
          { front: 'What is closed-loop communication?', back: 'A communication technique where the receiver repeats back the message to confirm understanding' },
          { front: 'What is the purpose of patient identification?', back: 'To ensure the right patient receives the right treatment and prevent medical errors' },
          { front: 'When should you speak up about safety?', back: 'Immediately when you observe any situation that could harm a patient' },
          { front: 'What is root cause analysis?', back: 'A systematic process to identify the underlying causes of an adverse event' },
          { front: 'Why are team huddles important?', back: 'They improve communication, identify potential issues, and align the team on priorities' },
          { front: 'What is the primary goal of fall prevention?', back: 'To identify at-risk patients and implement interventions to prevent injuries' }
        ],
        handoutMarkdown: `# Patient Safety Training - Participant Handout

## Introduction
Patient safety is everyone's responsibility. This guide provides key principles and practices to ensure safe, high-quality care.

## Five Rights of Medication Administration
1. **Right Patient** - Use two identifiers
2. **Right Drug** - Verify medication name
3. **Right Dose** - Calculate and double-check
4. **Right Route** - Confirm administration method
5. **Right Time** - Follow prescribed schedule

## SBAR Communication
- **S**ituation: What's happening now?
- **B**ackground: What's the context?
- **A**ssessment: What do I think the problem is?
- **R**ecommendation: What should we do?

## Infection Control Essentials
- Perform hand hygiene before and after patient contact
- Use appropriate personal protective equipment (PPE)
- Follow isolation precautions
- Clean equipment between patients

## Fall Prevention Strategies
- Assess all patients for fall risk
- Keep call bells within reach
- Ensure adequate lighting
- Keep floors clear of hazards
- Use assistive devices appropriately

## Error Reporting
- Report all errors and near-misses promptly
- Focus on system improvement, not blame
- Participate in root cause analysis
- Learn from incidents to prevent recurrence

## Key Takeaways
✓ Always verify patient identity
✓ Practice effective communication
✓ Follow standardized procedures
✓ Speak up when you see safety concerns
✓ Report errors to improve the system

## Resources
- Patient Safety Network: psnet.ahrq.gov
- Institute for Healthcare Improvement: ihi.org
- Your facility's safety hotline: [Insert Number]`,
        facilitatorGuideMarkdown: `# Patient Safety Training - Facilitator Guide

## Session Overview
**Duration:** 90 minutes
**Audience:** Healthcare professionals
**Format:** Interactive presentation with discussions and scenarios

## Learning Objectives
By the end of this session, participants will be able to:
1. Apply the Five Rights of Medication Administration
2. Use SBAR for effective communication
3. Implement infection control and fall prevention strategies
4. Report errors using a just culture approach

## Materials Needed
- Presentation slides
- Participant handouts
- Scenario cards for group discussions
- Hand hygiene supplies for demonstration
- PPE for demonstration

## Session Outline

### Introduction (10 minutes)
- Welcome and introductions
- Review agenda and learning objectives
- Ice breaker: "Share one safety practice you're proud of"

### Module 1: Safety Principles (15 minutes)
**Key Points:**
- Patient safety requires a team approach
- Every interaction is an opportunity to prevent harm
- Communication is the foundation of safe care

**Activity:** Think-Pair-Share
- Have participants discuss a time when good communication prevented an error

### Module 2: Medication Safety (15 minutes)
**Key Points:**
- Review Five Rights with emphasis on double-checking
- Discuss high-alert medications
- Address interruption-free zones

**Activity:** Case Study
- Present a medication error scenario
- Group discusses what went wrong and how to prevent it

### Module 3: Infection Control & Fall Prevention (20 minutes)
**Key Points:**
- Demonstrate proper hand hygiene technique
- Show PPE donning and doffing
- Review fall risk assessment tools

**Activity:** Skills Practice
- Participants practice hand washing and PPE
- Walk through fall prevention checklist

### Module 4: Communication & Error Reporting (20 minutes)
**Key Points:**
- Practice SBAR scenarios
- Explain just culture principles
- Encourage speaking up

**Activity:** Role Play
- Pairs practice SBAR communication
- Discuss barriers to reporting and solutions

### Conclusion & Action Planning (10 minutes)
**Key Points:**
- Recap main concepts
- Commit to specific actions

**Activity:** Personal Commitment
- Each participant writes one safety action they'll implement
- Share commitments with the group

## Facilitation Tips

### Creating a Safe Learning Environment
- Emphasize that this is a judgment-free zone
- Encourage questions and sharing of experiences
- Acknowledge that mistakes happen and focus on learning

### Handling Difficult Discussions
- If participants share serious safety concerns, acknowledge them
- Direct them to appropriate reporting channels
- Keep discussions constructive and solution-focused

### Time Management
- Use a timer to stay on track
- Prepare to adjust activities if discussions run long
- Have extra scenarios ready if time permits

### Engagement Strategies
- Call on different participants throughout the session
- Use real-world examples from your facility
- Encourage peer-to-peer learning

## Assessment
- Observe participation in activities
- Review action commitments
- Follow-up quiz (optional): 10-question assessment on key concepts

## Follow-Up
- Send handouts and resources via email
- Schedule refresher training in 6 months
- Share any policy updates or safety alerts
- Collect feedback through evaluation forms

## Common Questions & Answers

**Q: What if I'm afraid of getting in trouble for reporting an error?**
A: Our facility practices just culture - we focus on fixing systems, not blaming individuals. Reporting helps prevent future errors.

**Q: How do I speak up if I see a more senior person making a mistake?**
A: Use phrases like "I want to clarify..." or "Can we pause and review..." Focus on patient safety, not hierarchy.

**Q: What if I'm too busy to follow all these procedures?**
A: Safety procedures are designed to be efficient and are non-negotiable. If workload is consistently preventing safe practice, that's a system issue that needs to be addressed.

## Resources for Facilitators
- AHRQ Patient Safety Resources
- IHI Open School modules
- Facility-specific policies and procedures
- Safety event reports (anonymized) for case studies`,
        backgroundImagePrompt: 'Professional healthcare setting with diverse medical team collaborating, modern hospital environment, clean and bright atmosphere'
      },
      'HIPAA Compliance': {
        slides: [
          {
            title: 'HIPAA Compliance Training',
            content: ['Protecting patient privacy', 'Understanding regulations', 'Your role in compliance'],
            speakerNotes: 'Begin with the importance of patient privacy and trust in healthcare.',
            visualSearchTerm: 'healthcare data privacy'
          },
          {
            title: 'What is HIPAA?',
            content: ['Health Insurance Portability and Accountability Act', 'Enacted in 1996', 'Protects patient health information', 'Sets national standards'],
            speakerNotes: 'Provide brief history and explain why HIPAA was created.',
            visualSearchTerm: 'healthcare compliance'
          },
          {
            title: 'Protected Health Information',
            content: ['Names and addresses', 'Medical record numbers', 'Dates of birth', 'Diagnosis and treatment info', 'Any info that identifies a patient'],
            speakerNotes: 'Give examples of PHI and non-PHI.',
            visualSearchTerm: 'medical records confidential'
          },
          {
            title: 'Privacy Rule',
            content: ['Limits use and disclosure of PHI', 'Gives patients rights over their info', 'Requires safeguards', 'Minimum necessary standard'],
            speakerNotes: 'Discuss patient rights including access and amendment.',
            visualSearchTerm: 'patient rights healthcare'
          },
          {
            title: 'Security Rule',
            content: ['Physical safeguards', 'Technical safeguards', 'Administrative safeguards', 'Risk assessment required'],
            speakerNotes: 'Explain how each type of safeguard protects electronic PHI.',
            visualSearchTerm: 'computer security healthcare'
          },
          {
            title: 'Breach Notification',
            content: ['Report breaches immediately', 'Notify affected individuals', 'Document the incident', 'Prevention is key'],
            speakerNotes: 'Review your organization\'s breach reporting process.',
            visualSearchTerm: 'data breach notification'
          },
          {
            title: 'Common Violations',
            content: ['Unauthorized access to records', 'Talking about patients in public', 'Improper disposal of documents', 'Unencrypted devices'],
            speakerNotes: 'Share examples and consequences of violations.',
            visualSearchTerm: 'healthcare privacy violation'
          },
          {
            title: 'Best Practices',
            content: ['Use secure passwords', 'Lock screens when away', 'Shred confidential documents', 'Only access need-to-know information', 'Report suspicious activity'],
            speakerNotes: 'Have participants commit to following these practices daily.',
            visualSearchTerm: 'secure data practices'
          }
        ],
        flashcards: [
          { front: 'What does HIPAA stand for?', back: 'Health Insurance Portability and Accountability Act' },
          { front: 'What is PHI?', back: 'Protected Health Information - any information that can identify a patient and relates to their health' },
          { front: 'What is the minimum necessary standard?', back: 'Only access the minimum amount of PHI needed to accomplish your task' },
          { front: 'When should you report a potential breach?', back: 'Immediately upon discovery' },
          { front: 'What are the three types of safeguards?', back: 'Physical, Technical, and Administrative' },
          { front: 'Can you discuss patient cases in public areas?', back: 'No, even without using names, it could violate HIPAA' },
          { front: 'What should you do if you see unauthorized access to records?', back: 'Report it immediately to your supervisor or compliance officer' },
          { front: 'Are paper records covered by HIPAA?', back: 'Yes, HIPAA covers all forms of PHI, electronic and paper' },
          { front: 'What is a business associate?', back: 'A person or entity that performs functions involving PHI on behalf of a covered entity' },
          { front: 'What are patient rights under HIPAA?', back: 'Right to access records, request amendments, accounting of disclosures, and request restrictions' }
        ],
        handoutMarkdown: `# HIPAA Compliance Training - Quick Reference

## What is HIPAA?
The Health Insurance Portability and Accountability Act (HIPAA) protects patient health information and sets national standards for privacy and security.

## Protected Health Information (PHI)
Any information that can identify a patient:
- Names, addresses, phone numbers
- Medical record numbers
- Social Security numbers
- Dates (birth, admission, discharge, death)
- Photos
- Any other unique identifying information

## Key Rules

### Privacy Rule
- Limits who can see PHI
- Gives patients control over their health information
- Sets boundaries on use and disclosure
- Establishes safeguards

### Security Rule
- Protects electronic PHI (ePHI)
- Requires physical, technical, and administrative safeguards
- Mandates risk assessments

### Breach Notification Rule
- Requires notification of breaches
- Must report to affected individuals
- Large breaches reported to media and HHS

## Your Responsibilities

### DO:
✓ Access only information needed for your job
✓ Log out when leaving your workstation
✓ Shred documents containing PHI
✓ Use secure messaging for patient information
✓ Report security incidents immediately

### DON'T:
✗ Share passwords or login credentials
✗ Discuss patients in public areas
✗ Access your own or family members' records (unless authorized)
✗ Take PHI home without authorization
✗ Post about patients on social media

## Common Scenarios

**Scenario 1:** A friend asks about a mutual friend who is a patient.
**Response:** "I can't discuss any patient information, even to confirm if someone is a patient here."

**Scenario 2:** You receive a fax not intended for you with patient information.
**Response:** Return or securely destroy the fax and notify the sender.

**Scenario 3:** You need to discuss a patient case with a colleague.
**Response:** Move to a private area where you won't be overheard.

## Penalties for Violations
- Civil penalties: Up to $50,000 per violation
- Criminal penalties: Fines and imprisonment possible
- Professional consequences: Job termination, license revocation

## Reporting
If you suspect a HIPAA violation or breach:
1. Report immediately to your supervisor
2. Contact your compliance officer
3. Document what you observed
4. Do not investigate on your own

## Questions?
Contact your Privacy Officer or Compliance Department`,
        facilitatorGuideMarkdown: `# HIPAA Compliance Training - Facilitator Guide

## Session Overview
**Duration:** 60 minutes
**Audience:** All healthcare staff with access to patient information
**Format:** Interactive presentation with scenarios and discussions
**Frequency:** Annual mandatory training

## Pre-Session Preparation
- [ ] Review any recent HIPAA updates or facility policy changes
- [ ] Prepare scenario cards
- [ ] Have sign-in sheet ready for compliance documentation
- [ ] Load presentation and test equipment
- [ ] Print participant handouts

## Learning Objectives
Participants will be able to:
1. Define HIPAA and explain its purpose
2. Identify Protected Health Information (PHI)
3. Apply Privacy and Security Rules in daily work
4. Recognize and report potential violations

## Detailed Session Plan

### Introduction (5 minutes)
**Activities:**
- Welcome and attendance
- Review objectives
- Emphasize that HIPAA protects patients and staff

**Talking Points:**
- "HIPAA compliance is everyone's responsibility"
- "Violations can result in serious consequences for you and the organization"
- "When in doubt, err on the side of caution"

### What is HIPAA? (10 minutes)
**Key Concepts:**
- Brief history and purpose
- Types of covered entities
- Business associates

**Teaching Tips:**
- Use timeline to show HIPAA evolution
- Explain how it affects daily workflows
- Give examples relevant to participants' roles

**Check for Understanding:**
"Can anyone give an example of why HIPAA was needed?"

### Protected Health Information (10 minutes)
**Key Concepts:**
- What qualifies as PHI
- De-identified information
- Limited data sets

**Interactive Element:**
Present various pieces of information and have group identify if it's PHI:
- Patient name + diagnosis = PHI
- Age range + zip code = May be PHI depending on specificity
- Diagnosis alone (no identifiers) = Not PHI

### Privacy and Security Rules (15 minutes)
**Key Concepts:**
- Privacy Rule basics
- Security Rule safeguards
- Minimum necessary standard

**Case Studies:**
Present 2-3 scenarios for group discussion:

1. **Email Scenario:** Staff member emails patient list to personal email to work from home
   - Discussion: Why is this a violation? What should they do instead?

2. **Disposal Scenario:** Printed patient schedules left in recycling bin
   - Discussion: What's the risk? Proper disposal method?

3. **Access Scenario:** Employee looks up celebrity patient out of curiosity
   - Discussion: Even if they don't share info, why is this wrong?

### Breach Notification & Violations (10 minutes)
**Key Concepts:**
- What constitutes a breach
- Reporting procedures
- Consequences of violations

**Important:**
- Emphasize immediate reporting requirement
- Explain that reporting helps prevent future breaches
- Clarify the difference between intentional and accidental violations

**Facility-Specific:**
Review your organization's breach reporting flowchart

### Best Practices & Action Planning (10 minutes)
**Key Concepts:**
- Daily habits for compliance
- When to ask for help
- Resources available

**Activities:**
- "Commitment Cards" - each participant writes one specific action they'll take
- Quick quiz (optional): 5-question knowledge check

### Wrap-Up (5 minutes)
- Answer remaining questions
- Distribute certificates of completion
- Remind about annual retraining requirement
- Provide contact info for compliance questions

## Facilitation Tips

### Creating Engagement
- Use real examples (anonymized) from your facility
- Encourage participants to share their concerns and questions
- Make it relevant to their specific roles

### Handling Difficult Questions
- **"Why can't I just quickly check on my friend who's a patient?"**
  Response: "Even well-intentioned access without authorization is a violation. Patient privacy applies to everyone."

- **"These rules make my job harder."**
  Response: "HIPAA is designed to protect patients without preventing necessary care. If a process seems inefficient, let's discuss proper workflows."

- **"What if it's an emergency?"**
  Response: "HIPAA allows disclosure for treatment, payment, and healthcare operations. In true emergencies, providing care comes first."

### Managing Time
- If pressed for time, prioritize slides 1-7
- Can condense historical information
- Always leave time for scenarios and questions

### Assessment
Ensure participants can:
- Identify at least 3 types of PHI
- Describe the minimum necessary standard
- Know how to report a suspected breach

## Documentation
- Maintain attendance records
- Keep certificates of completion
- Document any questions or concerns raised
- Report training completion to compliance department

## Follow-Up
- Send email with handout and resources
- Post FAQs on intranet
- Schedule refresher sessions as needed
- Update training based on participant feedback

## Additional Resources
- HHS HIPAA website: hhs.gov/hipaa
- HIPAA Journal: hipaajournal.com
- Your facility's HIPAA policies and procedures manual
- Compliance officer contact information`,
        backgroundImagePrompt: 'Secure medical data, digital healthcare security, professional setting with lock and shield symbols, modern and trustworthy atmosphere'
      }
    },
    'Technology': {
      'Cybersecurity Basics': {
        slides: [
          {
            title: 'Cybersecurity Fundamentals',
            content: ['Protecting digital assets', 'Understanding threats', 'Building security awareness'],
            speakerNotes: 'Set the context for why cybersecurity matters to everyone in the organization.',
            visualSearchTerm: 'cybersecurity protection'
          },
          {
            title: 'Common Threats',
            content: ['Phishing attacks', 'Malware and ransomware', 'Social engineering', 'Insider threats'],
            speakerNotes: 'Provide examples of each threat type with real-world incidents.',
            visualSearchTerm: 'cyber attack hacker'
          },
          {
            title: 'Password Security',
            content: ['Use strong, unique passwords', 'Enable multi-factor authentication', 'Password managers', 'Never share credentials'],
            speakerNotes: 'Demonstrate creating a strong password and using MFA.',
            visualSearchTerm: 'password security lock'
          },
          {
            title: 'Recognizing Phishing',
            content: ['Suspicious sender addresses', 'Urgent or threatening language', 'Requests for sensitive info', 'Unexpected attachments or links'],
            speakerNotes: 'Show examples of phishing emails and how to verify legitimacy.',
            visualSearchTerm: 'phishing email scam'
          },
          {
            title: 'Safe Browsing Practices',
            content: ['Verify website security (HTTPS)', 'Avoid public Wi-Fi for sensitive tasks', 'Keep browsers updated', 'Use VPN when needed'],
            speakerNotes: 'Explain how to check for secure connections.',
            visualSearchTerm: 'secure internet browsing'
          },
          {
            title: 'Data Protection',
            content: ['Encrypt sensitive data', 'Regular backups', 'Secure file sharing', 'Proper disposal of old devices'],
            speakerNotes: 'Discuss organizational policies for data handling.',
            visualSearchTerm: 'data encryption protection'
          },
          {
            title: 'Mobile Device Security',
            content: ['Enable device lock', 'Install security updates', 'Be cautious with app permissions', 'Report lost devices immediately'],
            speakerNotes: 'Remind about BYOD policies if applicable.',
            visualSearchTerm: 'mobile phone security'
          },
          {
            title: 'Incident Response',
            content: ['Recognize potential incidents', 'Report immediately to IT', 'Do not attempt to fix yourself', 'Preserve evidence', 'Learn from incidents'],
            speakerNotes: 'Share incident reporting procedures and emphasize quick response.',
            visualSearchTerm: 'cybersecurity team response'
          }
        ],
        flashcards: [
          { front: 'What is phishing?', back: 'A social engineering attack where attackers impersonate legitimate sources to trick victims into revealing sensitive information' },
          { front: 'What is multi-factor authentication (MFA)?', back: 'A security method requiring two or more verification factors to gain access to an account' },
          { front: 'What does HTTPS indicate?', back: 'A secure, encrypted connection between your browser and the website' },
          { front: 'What is ransomware?', back: 'Malware that encrypts victim\'s data and demands payment for the decryption key' },
          { front: 'What is social engineering?', back: 'Manipulating people into divulging confidential information or performing actions that compromise security' },
          { front: 'What makes a strong password?', back: 'At least 12 characters with a mix of uppercase, lowercase, numbers, and symbols; unique and not reused' },
          { front: 'What should you do if you click a suspicious link?', back: 'Immediately disconnect from network, report to IT, and do not enter any credentials' },
          { front: 'Why should you use a password manager?', back: 'It securely stores unique passwords for all accounts, reducing the risk of password reuse' },
          { front: 'What is an insider threat?', back: 'A security risk that comes from within the organization, such as employees with malicious intent or careless behaviors' },
          { front: 'When should you report a security incident?', back: 'Immediately upon discovery, no matter how minor it seems' }
        ],
        handoutMarkdown: `# Cybersecurity Basics - Essential Guide

## Why Cybersecurity Matters
Every employee is a target. Cyber attacks can lead to:
- Data breaches and loss of sensitive information
- Financial losses
- Reputation damage
- Legal consequences

## Top Threats to Know

### Phishing
Email or messages that trick you into:
- Clicking malicious links
- Downloading malware
- Revealing passwords or sensitive data

**Red Flags:**
- Urgent or threatening language
- Suspicious sender addresses
- Requests for sensitive information
- Generic greetings ("Dear Customer")
- Poor grammar or spelling

### Malware & Ransomware
Malicious software that can:
- Steal data
- Encrypt files and demand ransom
- Spy on activities
- Use your device for attacks on others

**Prevention:**
- Keep software updated
- Don't download from untrusted sources
- Use antivirus software
- Regular backups

### Social Engineering
Psychological manipulation to:
- Gain unauthorized access
- Trick you into breaking security procedures
- Obtain confidential information

**Example Tactics:**
- Impersonating IT support
- Creating false emergencies
- Building trust over time
- Authority manipulation

## Password Security Best Practices

### Creating Strong Passwords
✓ At least 12 characters long
✓ Mix of uppercase and lowercase letters
✓ Include numbers and symbols
✓ Unique for each account
✓ Not based on personal information

### What to Avoid
✗ Common words or patterns (Password123)
✗ Personal information (birthdays, names)
✗ Sequential characters (abc123, 111111)
✗ Reusing passwords across accounts

### Multi-Factor Authentication (MFA)
Always enable MFA when available:
- Something you know (password)
- Something you have (phone, token)
- Something you are (fingerprint, face)

## Safe Computing Habits

### Email Safety
- Verify sender before opening attachments
- Hover over links to see actual URL
- Don't trust urgent requests without verification
- Report suspicious emails to IT

### Web Browsing
- Look for HTTPS and padlock icon
- Avoid public Wi-Fi for sensitive tasks
- Keep browser and plugins updated
- Clear cache and cookies regularly

### Mobile Devices
- Use device lock (PIN, biometric)
- Install updates promptly
- Review app permissions
- Enable remote wipe capability
- Report lost/stolen devices immediately

### Physical Security
- Lock your screen when away
- Don't leave devices unattended
- Shred sensitive documents
- Be aware of shoulder surfing
- Secure work-from-home setup

## Data Protection

### Handling Sensitive Information
- Only access what you need for your job
- Use approved channels for sharing
- Encrypt sensitive files
- Follow data retention policies
- Proper disposal of old devices/documents

### Backup Strategy
- Regular automated backups
- Test restore procedures
- Keep backups offline or air-gapped
- Follow 3-2-1 rule: 3 copies, 2 different media, 1 offsite

## Incident Response

### Recognize the Signs
- Unexpected popups or warnings
- Slow system performance
- Unknown programs running
- Changed passwords or settings
- Suspicious account activity
- Missing files or data

### What to Do
1. **Stop** - Don't continue using the device
2. **Disconnect** - Unplug from network if possible
3. **Report** - Contact IT/Security immediately
4. **Preserve** - Don't delete anything
5. **Document** - Write down what happened

### Who to Contact
- IT Help Desk: [Insert Number]
- Security Team: [Insert Email]
- After Hours: [Insert Number]

## Quick Reference Checklist

Daily:
□ Lock screen when away
□ Verify suspicious emails
□ Check for updates

Weekly:
□ Review account activity
□ Update passwords if needed
□ Clear browser data

Monthly:
□ Review app permissions
□ Test backups
□ Security awareness refresher

## Resources
- Internal Security Portal: [Insert URL]
- Phishing Reporting Tool: [Insert Tool]
- Security Policies: [Insert Location]
- Training Resources: [Insert URL]

**Remember:** When in doubt, reach out! It's better to ask than to risk a security incident.`,
        facilitatorGuideMarkdown: `# Cybersecurity Basics - Facilitator Guide

## Training Overview
**Duration:** 75-90 minutes
**Audience:** All employees
**Format:** Interactive presentation with hands-on demonstrations
**Prerequisites:** None
**Frequency:** Annual mandatory training with quarterly refreshers

## Learning Objectives
By the end of this training, participants will be able to:
1. Identify common cybersecurity threats
2. Apply password security best practices
3. Recognize and report phishing attempts
4. Follow safe computing procedures
5. Respond appropriately to security incidents

## Pre-Session Setup (15 minutes before)
- [ ] Test all equipment (projector, internet connection)
- [ ] Load presentation and demo materials
- [ ] Prepare phishing email examples
- [ ] Set up demo accounts for hands-on activities
- [ ] Distribute sign-in sheets
- [ ] Print handouts and place at seats
- [ ] Queue up any video demonstrations
- [ ] Test phishing simulation tool (if using)

## Materials Needed
- Presentation slides
- Participant handouts
- Sample phishing emails (print and digital)
- MFA demonstration device
- Password strength checker tool
- Scenario cards for group activities
- Certificates of completion
- Evaluation forms

## Detailed Session Plan

### Introduction (5-10 minutes)

**Welcome & Housekeeping**
- Introduce yourself and your role
- Cover logistics (breaks, restrooms, emergency exits)
- Set ground rules for participation

**Icebreaker Activity:**
"Show of hands: How many of you have received a suspicious email this week?"
- Creates engagement
- Shows real-world relevance
- No wrong answers to reduce anxiety

**Learning Objectives Review**
- Explain what participants will learn
- Emphasize practical, immediately applicable skills
- Address "What's in it for me?"

### Module 1: Threat Landscape (15 minutes)

**Key Messages:**
- Cyber threats are constantly evolving
- Everyone is a target, not just IT
- Small mistakes can have big consequences

**Content Delivery:**
- Present recent, relevant cyber attack examples
- Show statistics about costs and frequency
- Explain attacker motivations

**Interactive Element:**
"Think of a cyber attack you've heard about in the news. What happened?"
- Facilitates discussion
- Assesses baseline knowledge
- Makes it relatable

**Demonstration:**
Show a recent phishing campaign that targeted similar organizations
- Explain the tactics used
- Discuss why it was effective
- Highlight how it could have been prevented

### Module 2: Phishing Deep Dive (20 minutes)

**This is the most critical module - phishing is the #1 attack vector**

**Activity 1: Spot the Phish (10 minutes)**
Display 4-5 emails (mix of legitimate and phishing):
- Have participants vote on each
- Discuss red flags and verification methods
- Show the actual indicators in the email headers

**Examples to Include:**
1. Obvious spam (easy warm-up)
2. Sophisticated spear phishing attempt
3. CEO fraud/BEC example
4. Credential harvesting page
5. Legitimate email that looks suspicious

**Teaching Points for Each:**
- What makes it suspicious?
- How could you verify it?
- What's the potential impact?
- Proper response procedure

**Activity 2: Live Verification Demo (5 minutes)**
Show how to:
- Hover over links to see actual URLs
- Check email headers
- Verify sender through alternative channel
- Report through organizational tool

**Common Questions:**
- "What if I already clicked?" → Immediate steps to take
- "How do I know if it's really from my boss?" → Verification procedures
- "Can I forward to IT?" → Yes, proper reporting method

### Module 3: Password Security & MFA (15 minutes)

**Password Best Practices**

**Interactive Demo:**
Use a password strength checker tool:
- Show weak password examples
- Build a strong password together
- Explain password manager benefits

**Activity: Password Audit Challenge**
Have participants (privately) assess their own password practices:
- Do you reuse passwords?
- How long are they?
- When did you last change them?

No sharing required - this is for self-reflection

**Multi-Factor Authentication**

**Live Demonstration:**
Set up MFA on a demo account:
- Show different MFA methods (SMS, app, hardware key)
- Walk through setup process
- Demonstrate login with MFA

**Common Concerns:**
- "It's inconvenient" → Compare to recovering from breach
- "What if I lose my phone?" → Backup codes and recovery procedures
- "Is SMS secure enough?" → Discuss different MFA methods

### Module 4: Safe Computing Practices (15 minutes)

**Cover Essential Daily Habits:**

**Physical Security:**
- Demo the "walk away = lock away" principle
- Stand up and lock your computer in front of everyone
- Challenge: Make this automatic

**Web Browsing:**
- Show HTTPS vs HTTP examples
- Demonstrate checking certificate information
- Discuss public Wi-Fi risks

**Mobile Device Security:**
- Review BYOD policies (if applicable)
- Show security settings on smartphone
- Discuss app permissions

**Scenario Discussion:**
Present 2-3 scenarios for group analysis:

**Scenario 1: Coffee Shop Worker**
"You're working at a coffee shop and need to check your work email. What precautions should you take?"

Expected responses:
- Use VPN
- Verify network legitimacy
- Avoid sensitive tasks on public Wi-Fi
- Position screen away from others

**Scenario 2: Suspicious USB Drive**
"You find a USB drive in the parking lot labeled 'Salary Information.' What do you do?"

Expected responses:
- Never plug it in
- Report to security
- Explain potential malware risk

**Scenario 3: Urgent CEO Email**
"You receive an email from the CEO asking you to immediately purchase gift cards. What do you do?"

Expected responses:
- Verify through another channel
- Recognize as potential BEC scam
- Never act on urgent financial requests via email alone

### Module 5: Data Protection & Privacy (10 minutes)

**Key Concepts:**
- Data classification
- Encryption basics
- Secure file sharing
- Backup importance

**Activity: Data Handling Quiz**
Present situations and have participants identify proper handling:
- Emailing customer list
- Sharing financial documents
- Disposing of old laptop
- Working with confidential data

### Module 6: Incident Response (10 minutes)

**Critical Message: Speed Matters**

**Teach the Response Flow:**
1. Recognize something is wrong
2. Stop what you're doing
3. Disconnect if needed
4. Report immediately
5. Document what happened
6. Don't try to fix it yourself

**Emphasize:**
- No blame culture
- Fast reporting minimizes damage
- Provide specific contact information
- After-hours procedures

**Role Play:**
"You just clicked a link in an email and now your screen looks strange. Walk me through what you'd do."

Guide them through proper response procedure

### Wrap-Up & Assessment (10 minutes)

**Key Takeaways Review:**
Have participants share:
- One thing they learned
- One action they'll take immediately
- One question they still have

**Knowledge Check Options:**

**Option A: Quick Quiz (5 questions)**
1. What should you do if you receive a suspicious email?
2. Name two components of strong password security
3. What does HTTPS indicate?
4. When should you report a security incident?
5. True or False: It's safe to use public Wi-Fi for any work task if you're careful

**Option B: Exit Ticket**
Each participant writes:
- Most important thing learned today
- One security practice they'll implement this week

**Administrative:**
- Distribute certificates
- Collect evaluations
- Provide resource list
- Announce next training date

## Facilitation Best Practices

### Creating the Right Environment
**Do:**
- Make it conversational, not preachy
- Use humor appropriately
- Relate to real-world experiences
- Acknowledge that security can be inconvenient
- Praise good questions and participation

**Don't:**
- Shame participants for past mistakes
- Use excessive technical jargon
- Make it boring with just slides
- Skip the interactive elements
- Rush through due to time pressure

### Handling Different Learning Styles
- **Visual:** Use images, diagrams, and demonstrations
- **Auditory:** Discussions and clear explanations
- **Kinesthetic:** Hands-on activities and scenarios

### Managing Difficult Participants

**The Skeptic:** "This seems like overkill"
- Use real statistics and examples
- Connect to business impact
- Acknowledge inconvenience but emphasize necessity

**The Expert:** Tries to show off knowledge
- Acknowledge their experience
- Invite them to share relevant examples
- Redirect if they dominate discussion

**The Disengaged:** On phone, not participating
- Use direct questions to re-engage
- Move around the room
- Make content more interactive

### Time Management Tips
- Set time limits for each activity
- Have a"parking lot" for off-topic questions
- Identify which content is essential vs. nice-to-have
- Be prepared to adjust on the fly

**If Running Short on Time:**
Priority order:
1. Phishing recognition (Module 2)
2. Incident response (Module 6)
3. Password security (Module 3)
4. Other modules can be condensed

### Making It Memorable
- Use storytelling
- Share real incidents (anonymized)
- Create catchy phrases ("When in doubt, check it out")
- End with a strong call to action

## Assessment & Follow-Up

### Measuring Effectiveness
- Pre/post knowledge assessments
- Phishing simulation results (if conducted)
- Incident reporting rates (should increase)
- Policy compliance metrics

### Post-Training Actions
- Send follow-up email with resources within 24 hours
- Conduct phishing simulation 1-2 weeks post-training
- Schedule refresher training in 6 months
- Make resources easily accessible (intranet, posters)

### Continuous Improvement
- Review evaluation feedback
- Track which modules generate most questions
- Update with new threat examples
- Incorporate lessons learned from actual incidents

## Resources for Facilitators

### Recommended Reading
- SANS Security Awareness Resources
- NIST Cybersecurity Framework
- KnowBe4 Training Materials
- CISA Security Tips

### Tools & Websites
- HaveIBeenPwned.com (check if accounts compromised)
- VirusTotal (check suspicious files/URLs)
- PhishTank (verified phishing sites)
- Google Transparency Report

### Internal Resources
- IT Security Policies: [Location]
- Incident Response Plan: [Location]
- Acceptable Use Policy: [Location]
- Contact List: [Location]

## Appendices

### Appendix A: Sample Phishing Emails
[Include 5-10 examples with annotations]

### Appendix B: Password Policy Template
[Your organization's specific requirements]

### Appendix C: Incident Reporting Form
[Copy of form or link to online version]

### Appendix D: Additional Scenarios
[Extra scenarios for extended sessions or advanced groups]

### Appendix E: FAQ Document
Common questions with detailed answers for reference

---

**Facilitator Notes:**
- Review any organizational policy updates before each session
- Customize examples to your industry/organization
- Keep content current with recent threats
- Make it engaging - security training doesn't have to be boring!
- Your enthusiasm matters - if you find it interesting, they will too

**Emergency Contacts:**
- IT Support: [Number]
- Security Team: [Number]
- Help Desk: [Number]

**Good luck! Remember: Your goal is to create security champions, not just check a compliance box.**`,
        backgroundImagePrompt: 'Modern cybersecurity operations center, digital security shields, blue technological theme, professional IT environment'
      }
    },
    'Retail': {
      'Customer Service Excellence': {
        slides: [
          {
            title: 'Customer Service Excellence',
            content: ['Creating memorable experiences', 'Building customer loyalty', 'Driving business success through service'],
            speakerNotes: 'Welcome participants and emphasize that excellent service is everyone\'s responsibility.',
            visualSearchTerm: 'retail customer service'
          },
          {
            title: 'Why Service Matters',
            content: ['Customers have choices', 'Service differentiates us', 'Happy customers return', 'Great service builds reputation'],
            speakerNotes: 'Share statistics about customer retention and word-of-mouth impact.',
            visualSearchTerm: 'happy retail customer'
          },
          {
            title: 'First Impressions',
            content: ['Smile and make eye contact', 'Greet within 10 seconds', 'Use positive body language', 'Give full attention'],
            speakerNotes: 'Demonstrate greeting techniques and discuss impact of first 30 seconds.',
            visualSearchTerm: 'welcoming retail staff'
          },
          {
            title: 'Active Listening',
            content: ['Listen more than you talk', 'Ask clarifying questions', 'Repeat back to confirm', 'Show empathy'],
            speakerNotes: 'Practice active listening with role-play scenarios.',
            visualSearchTerm: 'attentive listening'
          },
          {
            title: 'Product Knowledge',
            content: ['Know your products inside out', 'Understand customer needs', 'Suggest appropriate solutions', 'Be honest about limitations'],
            speakerNotes: 'Emphasize the importance of ongoing product education.',
            visualSearchTerm: 'retail product display'
          },
          {
            title: 'Handling Difficult Situations',
            content: ['Stay calm and professional', 'Acknowledge the customer\'s feelings', 'Focus on solutions', 'Know when to escalate'],
            speakerNotes: 'Share techniques for de-escalation and conflict resolution.',
            visualSearchTerm: 'professional conflict resolution'
          },
          {
            title: 'Going the Extra Mile',
            content: ['Anticipate needs', 'Personalize the experience', 'Follow up when appropriate', 'Create wow moments'],
            speakerNotes: 'Share examples of extraordinary service that participants have experienced.',
            visualSearchTerm: 'exceptional customer experience'
          },
          {
            title: 'Service Mindset',
            content: ['Every interaction matters', 'Be present and engaged', 'Take ownership', 'Represent the brand with pride'],
            speakerNotes: 'End with a motivational message about their role as brand ambassadors.',
            visualSearchTerm: 'proud retail team'
          }
        ],
        flashcards: [
          { front: 'What is the 10-second rule?', back: 'Acknowledge and greet every customer within 10 seconds of them entering your area' },
          { front: 'What is active listening?', back: 'Fully concentrating on what the customer is saying, understanding their message, and responding thoughtfully' },
          { front: 'How should you handle an angry customer?', back: 'Stay calm, listen without interrupting, acknowledge their feelings, apologize, and focus on finding a solution' },
          { front: 'Why is product knowledge important?', back: 'It builds customer confidence, enables you to make appropriate recommendations, and establishes you as a trusted advisor' },
          { front: 'What does going the extra mile mean?', back: 'Exceeding customer expectations by doing more than the minimum required' },
          { front: 'When should you escalate to a manager?', back: 'When you\'ve exhausted your options, the customer requests it, or the situation is beyond your authority' },
          { front: 'What is empathy in customer service?', back: 'Understanding and sharing the feelings of the customer, making them feel heard and validated' },
          { front: 'What makes a positive first impression?', back: 'Friendly greeting, smile, eye contact, positive body language, and giving full attention' },
          { front: 'Why does customer service matter?', back: 'It differentiates the business, builds loyalty, generates repeat business, and creates positive word-of-mouth' },
          { front: 'What is service recovery?', back: 'The process of turning a negative customer experience into a positive one through effective problem-solving' }
        ],
        handoutMarkdown: `# Customer Service Excellence - Team Guide

## The Power of Great Service
Great customer service isn't just a nice-to-have—it's the foundation of our business success. Every interaction is an opportunity to create a loyal customer and brand advocate.

## Core Service Principles

### 1. First Impressions Matter
**The 10-Second Rule:** Acknowledge every customer within 10 seconds
- Make eye contact
- Smile genuinely
- Offer a friendly greeting
- Use open body language

**Your attitude is contagious—make sure it's worth catching!**

### 2. Active Listening
**Do:**
✓ Give your full attention
✓ Maintain eye contact
✓ Ask clarifying questions
✓ Summarize to confirm understanding
✓ Show empathy

**Don't:**
✗ Interrupt
✗ Check your phone
✗ Finish their sentences
✗ Assume you know what they need
✗ Judge

### 3. Product Knowledge is Power
**Why it matters:**
- Builds customer confidence
- Enables better recommendations
- Saves time
- Establishes trust

**Commit to:**
- Learning about new products
- Understanding features and benefits
- Knowing what problems each product solves
- Being honest when you don't know (and finding out)

### 4. Communication Excellence

**Verbal Communication:**
- Use positive language ("I can help you with that" vs. "I can't do that")
- Speak clearly and at a moderate pace
- Avoid jargon and technical terms
- Match customer's communication style

**Non-Verbal Communication:**
- Maintain friendly eye contact
- Use open body language
- Be aware of facial expressions
- Respect personal space

### 5. Problem-Solving Skills

**The Solution Framework:**
1. **Listen** - Let customer explain fully
2. **Empathize** - Acknowledge their feelings
3. **Apologize** - Even if it wasn't your fault
4. **Ask** - Questions to understand the issue
5. **Solve** - Offer solutions
6. **Follow-up** - Ensure satisfaction

## Handling Difficult Situations

### De-escalation Techniques
**Stay Calm:**
- Control your emotions
- Keep your voice steady
- Breathe

**Show Empathy:**
- "I understand how frustrating this must be"
- "I can see why you'd be upset"
- "I would feel the same way"

**Focus on Solutions:**
- "Here's what I can do for you..."
- "Let me see how I can help"
- "I want to make this right"

**When to Escalate:**
- You've exhausted your options
- Customer requests a manager
- Situation requires higher authority
- You feel threatened or unsafe

### The LAST Method for Complaints
**L**isten - Let them vent without interruption
**A**pologize - Sincere apology for their experience
**S**olve - Offer a solution or options
**T**hank - Thank them for bringing it to your attention

## Going the Extra Mile

### Ways to Exceed Expectations:
- **Anticipate needs** - "Would you like a bag for that?"
- **Personalize** - Remember returning customers
- **Follow up** - "Did everything work out with your purchase?"
- **Add value** - Share tips or related information
- **Surprise and delight** - Small gestures create big impact

### Creating WOW Moments:
- Help beyond your department
- Walk customers to products instead of pointing
- Offer to carry heavy items
- Share insider tips and recommendations
- Remember names and preferences

## Service Recovery
When things go wrong, you have a chance to create a loyal customer:

**The Service Recovery Paradox:**
Customers whose problems are resolved quickly and effectively often become more loyal than those who never had a problem.

**Keys to Great Recovery:**
1. Act quickly
2. Take ownership
3. Don't make excuses
4. Over-deliver on the solution
5. Follow up to ensure satisfaction

## Common Scenarios & Responses

### "I want to speak to your manager"
**Response:** "I'd be happy to get a manager for you. Can I ask what the concern is so I can brief them and we can help you faster?"

### "Your competitor has this cheaper"
**Response:** "I appreciate you mentioning that. Let me share why our product offers great value..." [Focus on benefits, service, quality]

### "This is taking too long"
**Response:** "I apologize for the wait. I'm working as quickly as I can to help you. Let me see what I can do to speed this up."

### "I don't have my receipt"
**Response:** "Let me see what options we have. Can I get some information about when and how you purchased this?"

## Self-Assessment Checklist

Rate yourself weekly:
□ I greet customers promptly and warmly
□ I listen actively without interrupting
□ I maintain positive body language
□ I know my products well
□ I handle complaints professionally
□ I take ownership of problems
□ I look for ways to exceed expectations
□ I represent the brand with pride

## Your Service Commitment

I commit to:
1. ________________________________
2. ________________________________
3. ________________________________

## Quick Tips for Busy Times
- Acknowledge customers even if you can't help immediately
- Manage expectations about wait times
- Stay positive and energized
- Work as a team
- Take care of yourself to take care of customers

## Remember
- **Every customer deserves your best**
- **You are a brand ambassador**
- **Your attitude affects everyone around you**
- **Problems are opportunities**
- **Service is what makes us different**

## Resources & Support
- Supervisor: [Name]
- Product Training: [Location]
- Service Standards: [Document]
- Customer Feedback: [System]

---

**"People will forget what you said, forget what you did, but they will never forget how you made them feel." - Maya Angelou**`,
        facilitatorGuideMarkdown: `# Customer Service Excellence - Facilitator Guide

## Training Overview
**Duration:** 3 hours (can be adapted to 2 hours or full day)
**Audience:** Front-line retail staff, customer-facing employees
**Format:** Interactive workshop with role-play, discussions, and activities
**Group Size:** Ideal 12-20 participants (can scale)
**Setting:** Training room with space for small group activities

## Training Objectives
By the end of this session, participants will be able to:
1. Apply techniques for creating positive first impressions
2. Demonstrate active listening skills
3. Handle difficult customers with professionalism
4. Use product knowledge to enhance customer experience
5. Identify opportunities to exceed customer expectations

## Materials & Preparation

### Equipment Needed:
- Projector and screen
- Laptop with presentation
- Flip charts and markers
- Sticky notes
- Name tags
- Timer

### Handouts & Materials:
- Participant workbooks/handouts
- Scenario cards for role-plays
- Service standards reference cards
- Evaluation forms
- Certificates of completion

### Room Setup:
- Tables arranged for small groups (4-5 people each)
- Space cleared for role-play activities
- Refreshments if possible
- Welcome sign/agenda on display

### Pre-Session Preparation:
- [ ] Review recent customer feedback/complaints
- [ ] Prepare relevant examples from your store
- [ ] Create realistic role-play scenarios
- [ ] Test all technology
- [ ] Print all materials
- [ ] Arrange for any guest speakers (optional)
- [ ] Prepare prizes for activities (optional)

## Detailed Session Plan

### Opening (20 minutes)

**Welcome & Introductions (10 min)**

**Activity: "Best Service Experience"**
- Have participants pair up
- Share a time they received exceptional service
- What made it memorable?
- Select 2-3 to share with full group

**Purpose:**
- Icebreaker
- Gets everyone talking
- Reminds them what great service feels like
- Sets positive tone

**Training Overview (10 min)**
- Review agenda
- State learning objectives
- Explain interactive format
- Set ground rules
- Address logistics (breaks, phones, etc.)

**Key Message:** "This isn't just about following rules—it's about creating experiences that customers remember and return for."

### Module 1: Why Service Excellence Matters (20 minutes)

**Business Case for Service (10 min)**

**Present Key Statistics:**
- Customer acquisition vs. retention costs
- Impact of word-of-mouth
- Lifetime value of loyal customers
- Effect of one bad experience

**Discussion Question:**
"What happens to our business when service is poor vs. excellent?"

Capture responses on flip chart:
- Poor service → Lost customers, bad reviews, decreased sales
- Excellent service → Loyalty, referrals, increased sales, job satisfaction

**Personal Impact (10 min)**

**Discuss:**
- How service affects your daily work experience
- Pride in doing the job well
- Tips/recognition/advancement opportunities
- Team morale

**Activity: "Service Ripple Effect"**
Show how one excellent (or poor) interaction can affect:
- That customer
- Other customers watching
- Your mood and energy
- Team atmosphere
- Store reputation
- Your own job satisfaction

### Module 2: First Impressions & Greetings (30 minutes)

**The Critical First 30 Seconds (10 min)**

**Key Concepts:**
- You never get a second chance at a first impression
- The 10-second rule
- Components of a great greeting

**Demonstration:**
Show WRONG way first (deliberately):
- Not looking up
- Weak greeting
- Closed body language
- Distracted

Then show RIGHT way:
- Immediate acknowledgment
- Eye contact and smile
- Friendly greeting
- Open body language

**Discussion:** "What did you notice in each example?"

**Body Language Matters (10 min)**

**Interactive Element:**
Play "Read the Body Language"
- Show photos or act out different body language
- Have group interpret
- Discuss impact on customers

**Cover:**
- Facial expressions
- Posture
- Gestures
- Eye contact
- Personal space

**Practice Activity (10 min)**

**Role-Play: The Perfect Greeting**
- Participants practice in pairs
- Switch roles
- Use different scenarios:
  - Busy customer in a hurry
  - Browsing customer
  - Returning customer with problem
  - First-time visitor

**Observer Checklist:**
□ Greeted within 10 seconds
□ Smiled genuinely
□ Made eye contact
□ Used friendly tone
□ Showed engagement

**Debrief:** What felt natural? What was challenging?

### Module 3: Active Listening Skills (30 minutes)

**What is Active Listening? (10 min)**

**Explain the difference:**
- Hearing vs. Listening
- Passive vs. Active Listening

**Components of Active Listening:**
- Pay attention (no distractions)
- Show you're listening (nods, "uh-huh")
- Provide feedback (paraphrase)
- Defer judgment (don't interrupt)
- Respond appropriately

**Demonstration:**
Act out a scenario showing poor listening:
- Looking at phone
- Interrupting
- Finishing sentences
- Not asking questions

Then show active listening:
- Full attention
- Clarifying questions
- Summarizing
- Empathetic responses

**Barriers to Effective Listening (10 min)**

**Group Discussion:**
"What prevents us from listening effectively?"

Common barriers:
- Distractions
- Preconceptions
- Thinking about your response
- Interruptions
- Fatigue
- Noise

**Solutions Brainstorm:**
How to overcome each barrier in our environment?

**Practice Activity (10 min)**

**Listening Exercise:**
- Groups of 3: Talker, Listener, Observer
- Talker: Describe product they want (with specific needs)
- Listener: Practice active listening, ask questions
- Observer: Note techniques used

**Rotate roles**

**Debrief Questions:**
- Talker: Did you feel heard?
- Listener: What was challenging?
- Observer: What did you notice?

### BREAK (15 minutes)

### Module 4: Product Knowledge & Consultative Selling (35 minutes)

**Knowledge is Confidence (10 min)**

**Discussion:**
"Think of a time you asked a salesperson a question and they didn't know the answer. How did that feel?"

**Why Product Knowledge Matters:**
- Builds trust
- Enables recommendations
- Saves time
- Increases sales
- Enhances credibility

**Beyond Features: Benefits & Solutions (10 min)**

**Teach the Formula:**
Feature → Benefit → Solution to Customer Need

**Examples:**
- Feature: "This jacket is water-resistant"
- Benefit: "You'll stay dry in light rain"
- Solution: "Perfect for your morning commute!"

**Activity: Feature/Benefit Translation**
- Provide product examples
- Groups convert features to benefits
- Share with larger group

**Consultative Approach (10 min)**

**The QUEST Method:**
- **Q**uestion - Ask about needs
- **U**nderstand - Listen to responses
- **E**ducate - Share relevant information
- **S**uggest - Recommend solutions
- **T**ransition - Move to close or next steps

**Demonstration:**
Show consultative approach vs. pushy sales tactics

**Practice Activity (15 min after Module 5)**

**Role-Play: Product Consultation**
Will combine with handling objections in next module

### Module 5: Handling Difficult Situations (40 minutes)

**Understanding Customer Frustration (10 min)**

**Empathy Exercise:**
"Think of the last time you were frustrated as a customer. What did you want from the employee?"

Common wants:
- To be heard
- Acknowledgment of the problem
- Sincere apology
- Quick solution
- Respect

**Types of Difficult Customers:**
- The Angry Customer
- The Indecisive Customer
- The Know-It-All
- The Silent Type
- The Bargain Hunter

**Discuss approaches for each**

**De-escalation Techniques (15 min)**

**The LAST Method:**
- **L**isten without interrupting
- **A**pologize sincerely
- **S**olve or offer solutions
- **T**hank them

**Key Phrases:**
- "I understand how frustrating this must be"
- "I apologize for this experience"
- "Let me see what I can do to help"
- "I want to make this right"

**What NOT to Say:**
- "That's not my job"
- "There's nothing I can do"
- "You should have..."
- "Calm down"
- "That's our policy" (without offering solutions)

**Video or Live Demonstration:**
Show de-escalation in action

**When to Escalate:**
- You've tried everything in your power
- Customer specifically requests manager
- Situation requires higher authority
- You feel uncomfortable or threatened

**Practice Activity (15 min)**

**Role-Play: Difficult Scenarios**

Provide scenario cards:

**Scenario 1: The Angry Return**
Customer wants to return item without receipt, past return period

**Scenario 2: The Long Wait**
Customer upset about waiting 15 minutes, other customers need help too

**Scenario 3: The Price Match**
Customer insists competitor has lower price, no proof

**Scenario 4: The Product Defect**
Customer received defective item, wants refund plus compensation

**Groups of 3:**
- Customer (can be difficult)
- Employee (practice techniques)
- Observer (provides feedback)

**Rotation:** Everyone plays each role

**Debrief:**
- What worked well?
- What was challenging?
- Techniques that felt most effective?
- How did it feel to be the difficult customer?

### Module 6: Going the Extra Mile (25 minutes)

**Service vs. Experience (10 min)**

**Discussion:**
"What's the difference between adequate service and exceptional service?"

**The Service Spectrum:**
- Disappointing: Below expectations
- Adequate: Meets basic expectations
- Satisfactory: Meets all expectations
- Excellent: Exceeds expectations
- Exceptional: Creates wow moments

**Goal:** Consistently deliver excellent, occasionally exceptional

**Creating WOW Moments (10 min)**

**Brainstorm Activity:**
"What are simple ways we can exceed expectations?"

Examples:
- Carrying purchases to car
- Offering water on hot day
- Writing thank-you notes
- Remembering returning customers
- Going to another store to check stock
- Teaching them something new about product
- Following up after purchase
- Suggesting money-saving alternatives

**Real Examples:**
Share stories of extra-mile service from your organization or others

**The ROI of Going Extra:**
- Loyal customers
- Positive reviews
- Word-of-mouth referrals
- Personal satisfaction
- Recognition opportunities

**Activity: Service Ideas (5 min)**

Each person writes on sticky note:
"One way I will go the extra mile this week"

Post on wall - creates accountability and idea sharing

### Module 7: Service Mindset & Wrap-Up (20 minutes)

**Your Role as Brand Ambassador (5 min)**

**Key Message:**
"Every interaction you have represents our entire company to that customer"

**Discussion:**
"What do you want customers to say about us?"

Capture on flip chart - this becomes the aspiration

**Building a Service Culture (5 min)**

**Individual Responsibility:**
- Your attitude is contagious
- Lead by example
- Support your teammates
- Speak positively
- Take pride in your work

**Team Responsibility:**
- Help each other during busy times
- Share best practices
- Celebrate service wins
- Give constructive feedback
- Create positive environment

**Action Planning (5 min)**

**Personal Commitment:**
Each participant completes:
"Three things I will do differently/better after today:"
1. _________________________
2. _________________________
3. _________________________

**Recap & Key Takeaways (5 min)**

Review main points:
- First impressions set the tone
- Active listening builds connection
- Product knowledge enables great recommendations
- Stay calm and solution-focused with difficulties
- Look for ways to exceed expectations
- You are a brand ambassador

**Final Thought:**
"The goal isn't perfection—it's progress. Every customer is a new opportunity to practice these skills."

### Closing Activity: Service Pledge (10 minutes)

**Group Activity:**
Create a team service pledge

- What do we commit to as a team?
- Post in break room or back office
- Everyone signs

**Example:**
"We commit to greeting every customer with a smile, listening to understand their needs, and going the extra mile to create memorable experiences."

**Evaluation & Certificates**
- Distribute evaluation forms
- Award certificates
- Thank participants
- Provide contact info for follow-up questions

## Facilitation Tips

### Creating Engagement
- **Use real examples** from your store/organization
- **Encourage storytelling** - everyone has service experiences
- **Make it safe** - no judgment for past mistakes
- **Keep energy high** - use movement, vary activities
- **Relate to their world** - avoid corporate jargon

### Managing Group Dynamics

**If someone dominates:**
- Thank them for input
- "Let's hear from someone who hasn't shared yet"
- Use structured turn-taking activities

**If group is quiet:**
- Start with pair shares before full group
- Use anonymous sticky notes
- Call on specific people gently
- Share your own experiences first

**If someone is negative:**
- Acknowledge concerns
- Redirect to solutions
- "What would make this better?"
- Follow up privately if needed

### Handling Tough Questions

**"What if corporate policies prevent good service?"**
Response: "Focus on what you CAN control. If a policy is truly problematic, there are channels to provide feedback. In the meantime, how can we work within it to still provide great service?"

**"Customers are often rude to us—why should we be nice to them?"**
Response: "You're right that it can be challenging. Great service isn't about accepting abuse—you always have the right to set boundaries. But most customers respond to the energy we bring. Often, killing with kindness changes the interaction."

**"We don't have time for all this during busy periods"**
Response: "Many of these practices (greeting, listening, staying calm) actually SAVE time by preventing problems and building efficiency. But you're right that busy times are challenging. Let's talk about realistic adaptations."

### Time Management

**If running behind:**
Priority order:
1. First impressions (Module 2)
2. Handling difficulties (Module 5)
3. Active listening (Module 3)
4. Product knowledge (Module 4)
5. Going extra mile (Module 6)

Can condense by:
- Fewer role-plays
- Shorter discussions
- Combined activities

**If ahead of schedule:**
- Extend role-play time
- More examples and stories
- Deeper discussions
- Additional scenarios
- Guest speaker (manager shares service story)

### Making It Memorable

**Storytelling:**
- Personal anecdotes
- Customer feedback examples
- Success stories from team
- Industry examples

**Metaphors & Analogies:**
- "Service is like a bank account—deposits and withdrawals"
- "You're a host at a party, not a guard at a museum"
- "Kill them with kindness"

**Repetition of Key Concepts:**
- 10-second rule
- LAST method
- QUEST approach
- Feature-Benefit-Solution

**Visual Aids:**
- Posters with key messages
- Infographics
- Videos (if available)
- Props for demonstrations

## Assessment Strategies

### During Training:
- Observe role-play performances
- Listen to discussion contributions
- Review activity outputs
- Check for understanding with questions

### Post-Training:
- Evaluate forms for feedback
- Mystery shopper assessments (if available)
- Customer feedback scores
- Manager observations
- Self-assessment after 30 days

### Follow-Up Recommendations:
- Brief refresher at team meetings
- Share service wins
- Ongoing coaching
- Advanced training for top performers
- Peer mentoring program

## Adapting for Different Audiences

### New Hires:
- More time on basics
- Less assumption of knowledge
- Provide more structure
- Detailed product information

### Experienced Staff:
- Advanced scenarios
- Focus on refining skills
- Share their expertise
- Challenge with difficult situations
- Leadership elements

### Managers/Supervisors:
- Include coaching techniques
- Service recovery authority
- Handling escalations
- Building service culture
- Measuring and rewarding service

## Resources & Support Materials

### Supplementary Materials:
- Service standards pocket guide
- Quick reference cards
- Product knowledge resources
- Escalation procedures
- Customer service metrics dashboard

### Recommended Follow-Up:
- Weekly team huddles on service
- Monthly service champion recognition
- Quarterly refresher training
- Online micro-learning modules
- Book club (customer service books)

### Additional Training Topics:
- Advanced conflict resolution
- Cross-selling and upselling
- Phone and email etiquette
- Social media customer service
- Cultural sensitivity in service

## Trainer Self-Assessment

After each session, reflect:
- What went well?
- What would I change?
- Which activities were most effective?
- Where did I lose engagement?
- What questions/concerns came up repeatedly?
- How can I improve next time?

## Emergency Procedures

**If medical emergency:**
- Call for help immediately
- Follow facility procedures
- Don't move injured person unless necessary
- Document incident

**If fire alarm:**
- Stop training immediately
- Direct participants to exits
- Follow evacuation procedures
- Account for all participants
- Resume when safe or reschedule

**If disruptive participant:**
- Speak privately during break
- Set clear expectations
- If continues, ask to leave
- Document and report to HR

## Final Checklist

One week before:
□ Confirm participants
□ Reserve room
□ Order materials
□ Test equipment
□ Send reminder email

One day before:
□ Print materials
□ Prepare room
□ Test technology
□ Review content
□ Prepare examples

Day of:
□ Arrive early
□ Set up room
□ Welcome participants
□ Deliver great training!

After:
□ Collect evaluations
□ Send thank-you/resources
□ Process certificates
□ Document lessons learned
□ Plan follow-up

---

**Remember:** Your enthusiasm and belief in the importance of great service will inspire participants. Model the excellent customer service you want them to provide. Good luck!`,
        backgroundImagePrompt: 'Bright modern retail store with friendly staff helping customers, welcoming atmosphere, diverse shoppers, professional retail environment'
      }
    }
  };

  const industryData = templates[industry];
  if (!industryData) {
    return createFallbackKit(industry, topic);
  }

  const topicData = industryData[topic];
  if (!topicData) {
    return createFallbackKit(industry, topic);
  }

  return topicData;
}

function createFallbackKit(industry: string, topic: string): GeneratedKit {
  return {
    slides: [
      {
        title: `${topic} Training`,
        content: [`Welcome to ${industry}`, 'Building expertise', 'Professional development'],
        speakerNotes: 'Welcome participants to this training session.',
        visualSearchTerm: `${industry.toLowerCase()} professional training`
      },
      {
        title: 'Learning Objectives',
        content: ['Understand core concepts', 'Apply best practices', 'Develop practical skills'],
        speakerNotes: 'Review the key objectives for today\'s session.',
        visualSearchTerm: 'learning objectives training'
      },
      {
        title: 'Key Concepts',
        content: ['Foundational principles', 'Industry standards', 'Current trends', 'Practical applications'],
        speakerNotes: 'Introduce the main concepts we\'ll cover today.',
        visualSearchTerm: `${topic.toLowerCase()} concepts`
      },
      {
        title: 'Best Practices',
        content: ['Follow established guidelines', 'Learn from experience', 'Continuous improvement', 'Stay updated'],
        speakerNotes: 'Discuss proven methods and approaches in this field.',
        visualSearchTerm: 'best practices professional'
      },
      {
        title: 'Practical Application',
        content: ['Real-world scenarios', 'Hands-on practice', 'Problem-solving', 'Critical thinking'],
        speakerNotes: 'Transition to practical exercises and examples.',
        visualSearchTerm: `${industry.toLowerCase()} workplace`
      },
      {
        title: 'Summary & Next Steps',
        content: ['Review key takeaways', 'Apply what you learned', 'Continue learning', 'Additional resources'],
        speakerNotes: 'Summarize the session and provide next steps for participants.',
        visualSearchTerm: 'professional development growth'
      }
    ],
    flashcards: [
      { front: `What is the main focus of ${topic}?`, back: 'Understanding and applying core principles to achieve professional excellence' },
      { front: 'Why is continuous learning important?', back: 'It keeps skills current and improves effectiveness in your role' },
      { front: 'What are best practices?', back: 'Proven methods and approaches that consistently produce excellent results' },
      { front: `How does ${topic} apply to ${industry}?`, back: 'It provides essential knowledge and skills for success in this field' },
      { front: 'What is the benefit of practical application?', back: 'It helps reinforce learning and builds confidence in real-world situations' }
    ],
    handoutMarkdown: `# ${topic} Training - Participant Guide\n\n## Overview\nWelcome to the ${topic} training for ${industry} professionals.\n\n## Key Concepts\n- Foundational principles\n- Industry standards\n- Best practices\n- Practical applications\n\n## Learning Objectives\nBy the end of this training, you will be able to:\n1. Understand core concepts of ${topic}\n2. Apply best practices in your daily work\n3. Identify opportunities for improvement\n\n## Best Practices\n- Stay informed about industry trends\n- Apply what you learn consistently\n- Seek feedback and continuous improvement\n- Share knowledge with colleagues\n\n## Resources\n- Industry associations\n- Professional development courses\n- Relevant publications\n- Online learning platforms`,
    facilitatorGuideMarkdown: `# ${topic} Training - Facilitator Guide\n\n## Session Overview\n**Topic:** ${topic}\n**Industry:** ${industry}\n**Duration:** 90 minutes\n\n## Learning Objectives\n- Introduce participants to ${topic}\n- Provide practical skills and knowledge\n- Enable application in real-world scenarios\n\n## Session Outline\n1. Introduction (10 min)\n2. Core Concepts (20 min)\n3. Best Practices (25 min)\n4. Practical Application (25 min)\n5. Summary & Q&A (10 min)\n\n## Facilitation Tips\n- Encourage participation and questions\n- Use real-world examples\n- Relate concepts to participants' experiences\n- Allow time for practice and discussion\n\n## Materials Needed\n- Presentation slides\n- Participant handouts\n- Case studies or scenarios\n- Assessment materials`,
    backgroundImagePrompt: `Professional ${industry} training environment, modern and engaging, educational setting`
  };
}
