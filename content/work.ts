export type Study = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  categories: string[];
  status: string;
  image?: string;
  alt?: string;
  brief: string;
  challenge: string;
  experience: string;
  flow: string[];
  technologies: string[];
  production: string;
  services: string[];
  visibility: "published" | "draft";
  results?: string[];
};
export const studies: Study[] = [
  {
    slug: "environmental-ar-mirror",
    title: "A new world. Same you.",
    eyebrow: "Environmental AR mirror",
    summary:
      "A standing guest, a live reflection, and five environments to step into.",
    categories: ["Interactive", "Spatial"],
    status: "Experience design · Proposed scope",
    image: "/images/ar-environment-concept.webp",
    alt: "Concept visualization of a standing guest composited into a tropical scene on a large display",
    brief:
      "Create an immediate, standing-participant experience that places a guest inside one of five aspirational environments.",
    challenge:
      "Live separation, tracking and foreground layers need to remain aligned as a person moves. Every scene must make sense from the same standing position.",
    experience:
      "A guest steps into a marked capture area. The system tracks their position and assigns an environment at random. Background replacement and layered objects place the guest within the scene before the experience resets.",
    flow: [
      "Step into position",
      "Track and align",
      "Assign a scene",
      "Composite in real time",
      "Reset for next guest",
    ],
    technologies: [
      "Real-time compositing",
      "Body tracking",
      "Background separation",
      "Windows application",
      "Large-format display",
    ],
    production:
      "A fixed camera, standing mark, matte backdrop and controlled lighting support repeatable calibration. The scoped experience is live-only; capture and sharing are separate possibilities.",
    services: ["interactive-experiences", "hardware-software-integration"],
    visibility: "published",
  },
  {
    slug: "ai-portrait-experience",
    title: "The guest becomes the story.",
    eyebrow: "AI portrait experience",
    summary:
      "Personalized portraits, from camera capture to a finished physical print.",
    categories: ["AI", "Photo"],
    status: "Experience design · Final software scope",
    image: "/images/ai-portrait-concept.webp",
    alt: "Concept visualization of a personalized motorsport portrait beside a camera and photo print",
    brief:
      "Connect a guest’s creative selection to an approved portrait composition, with a clear path from capture to digital delivery and print.",
    challenge:
      "Keep the selected composition, consent, accepted capture, generated image and print job associated with the same session.",
    experience:
      "The guest chooses from six treatments, enters their details and provides the required consent. They review and can retake their camera photo before submitting it for one AI generation. The finished image appears on screen, is emailed and enters an automatic print queue.",
    flow: [
      "Choose a treatment",
      "Details and consent",
      "Capture and review",
      "Generate and preview",
      "Email and print",
    ],
    technologies: [
      "AI face composition",
      "Kiosk session flow",
      "Camera integration",
      "Email delivery",
      "Windows print agent",
    ],
    production:
      "The design uses approved bodies and environments. Retakes happen before generation; a second generated image is not part of this flow. Operator queue status and retry handling support the print station.",
    services: [
      "experiential-ai",
      "photo-experiences",
      "hardware-software-integration",
    ],
    visibility: "published",
  },
  {
    slug: "rhythm-shooting-challenge",
    title: "Find the beat. Take the shot.",
    eyebrow: "Gesture-controlled game",
    summary:
      "A basketball shooting motion becomes the controller for a rhythm challenge.",
    categories: ["Interactive", "Event Technology"],
    status: "Experience design · Proposed scope",
    image: "/images/gesture-basketball-concept.webp",
    alt: "Concept visualization of an empty-handed player making a shooting gesture toward three virtual basketball lanes",
    brief:
      "Combine a natural shooting gesture with beat-synchronized targets and immediate scoring feedback.",
    challenge:
      "Separate intentional gestures from incidental movement, classify direction and keep visual, audio and scoring timing coordinated.",
    experience:
      "After QR validation and station assignment, the player enters a guided tracking zone. A short tutorial introduces three lanes. Shooting gestures timed to incoming virtual hoops build a score, followed by results and a QR-accessible photo.",
    flow: [
      "Validate guest QR",
      "Guide positioning",
      "Practice and count in",
      "Play to the beat",
      "View results and photo",
    ],
    technologies: [
      "Unity for Windows",
      "Depth-camera tracking",
      "Gesture recognition",
      "Rhythm sequencing",
      "QR result delivery",
    ],
    production:
      "The proposed tracking baseline uses Nuitrack and an Orbbec Astra 2. Production-equivalent hardware, sensor placement, lighting, display latency and audio routing require validation. The system recognizes gestures; it does not track a physical basketball.",
    services: [
      "interactive-experiences",
      "event-software",
      "hardware-software-integration",
    ],
    visibility: "published",
  },
  {
    slug: "live-photo-mosaic",
    title: "Individual faces. One shared picture.",
    eyebrow: "Live photo mosaic",
    summary: "Mobile selfies become a growing, shared event display.",
    categories: ["Photo", "Web", "Installation"],
    status: "Experience design · Draft estimate",
    brief:
      "Bring contributions from multiple QR locations together on a central event display, then deliver the final mosaic by email.",
    challenge:
      "Coordinate mobile capture, image orientation and resizing, a live submission queue and reconnect behavior on the display.",
    experience:
      "Guests scan a QR code, enter their details, capture and review a selfie, then submit it. Each image joins a predefined grid on the event display. A final mosaic export is prepared for email delivery after the event.",
    flow: [
      "Scan event QR",
      "Capture and review",
      "Submit the photo",
      "Populate the grid",
      "Email final mosaic",
    ],
    technologies: [
      "Mobile browser camera",
      "Image processing",
      "Live photo queue",
      "Windows display web app",
      "Email delivery",
    ],
    production:
      "This is a sequential fixed-grid collage with an approved visual overlay. Intelligent colour matching and AI tile placement are outside the described scope. Reliable internet and participant consent are production dependencies.",
    services: ["event-software", "photo-experiences"],
    visibility: "published",
  },
  {
    slug: "spatial-selfie-experience",
    title: "A selfie with another dimension.",
    eyebrow: "Spatial selfie experience",
    summary:
      "A controlled capture journey connecting spatial media, checkout and secure delivery.",
    categories: ["Spatial", "Photo", "Event Technology"],
    status: "Experience design · Ballpark proposal",
    brief:
      "Guide a guest through a spatial-display selfie experience with coordinated payment, capture, compositing and mobile delivery.",
    challenge:
      "Unlock one session per confirmed purchase and recover cleanly from cancelled payments, interrupted connections and expired sessions.",
    experience:
      "In the recommended flow, a guest selects a package and pays. Confirmation unlocks a kiosk session. The guest captures and reviews a composited selfie, then scans a secure QR code to receive it.",
    flow: [
      "Select and pay",
      "Unlock one session",
      "Capture and composite",
      "Review the image",
      "Secure QR delivery",
    ],
    technologies: [
      "Kiosk web application",
      "Camera compositing",
      "Transaction-aware sessions",
      "Single-use tokens",
      "Secure media delivery",
    ],
    production:
      "Hardware compatibility, display alignment and the payment provider need confirmation. Reliable internet is required for the transaction journey; the proposed offline fallback is limited to nontransaction screens.",
    services: ["event-software", "hardware-software-integration"],
    visibility: "published",
  },
  {
    slug: "connected-discovery-hub",
    image: "/images/connected-photo-concept.webp",
    alt: "Concept visualization of an in-car guest selfie and an external portrait display",
    title: "One venue. Many ways in.",
    eyebrow: "Connected discovery hub",
    summary:
      "A mobile journey connecting in-car photo moments, discovery, games and rewards.",
    categories: ["Web", "Event Technology"],
    status: "Experience design · Concept and rough estimate",
    brief:
      "Connect multiple activation areas through one mobile experience that gives visitors a reason to explore and return.",
    challenge:
      "Make individual QR encounters feel like one journey while clarifying account, reward and existing CRM integration requirements.",
    experience:
      "A guest scans an entry QR code and creates a profile. Location-specific pages introduce vehicle content and games such as trivia or memory matching. An in-car selfie moment and an external photo carousel extend the experience. A home dashboard brings the guest back to their rewards and available experiences.",
    flow: [
      "Scan a location",
      "Create a profile",
      "Explore and play",
      "Collect reward points",
      "Discover another zone",
    ],
    technologies: [
      "Mobile web application",
      "Location-specific QR flows",
      "Mini-games",
      "Reward account design",
      "CRM integration planning",
    ],
    production:
      "The concept leaves CRM integration questions open. Optional in-car tablet video capture and a future redemption location are expansion ideas, not included completed features.",
    services: ["event-software", "creative-technology"],
    visibility: "published",
  },
];
const order = [
  "ai-portrait-experience",
  "connected-discovery-hub",
  "environmental-ar-mirror",
  "live-photo-mosaic",
  "spatial-selfie-experience",
  "rhythm-shooting-challenge",
];
export const publishedStudies = studies
  .filter((s) => s.visibility === "published")
  .sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug));
