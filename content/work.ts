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
    image: "/images/ar-environment-concept-v2.webp",
    alt: "Concept visualization of a standing guest composited into a tropical scene on a large display",
    brief:
      "Let a guest step in front of a screen and see themselves somewhere unexpected, with five different worlds to discover.",
    challenge:
      "The scene needs to move naturally with the person. Keeping their outline and the objects around them aligned is what makes the illusion feel convincing.",
    experience:
      "A guest steps into a marked capture area. The system tracks their position and assigns an environment at random. Background replacement and layered objects place the guest within the scene before the experience resets.",
    flow: [
      "Step into position",
      "Let the camera find you",
      "Discover your scene",
      "See yourself in the scene",
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
    image: "/images/ai-portrait-kiosk.webp",
    alt: "Custom InMoment AI photobooth kiosk with an integrated camera and guest screen beside a separate photo printer",
    brief:
      "Give guests a chance to become part of the event’s visual world, then send them home with their own portrait in print and by email.",
    challenge:
      "Every guest needs to receive their own picture. Their chosen style, photo permission, capture and finished print all have to stay together, even while other people are waiting.",
    experience:
      "The guest chooses from six treatments, enters their details and provides the required consent. They review and can retake their camera photo before submitting it for one AI generation. The finished image appears on screen, is emailed and enters an automatic print queue.",
    flow: [
      "Choose a portrait style",
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
    image: "/images/gesture-basketball-concept-v2.webp",
    alt: "Concept visualization of an empty-handed player making a shooting gesture toward three virtual basketball lanes",
    brief:
      "Turn a familiar shooting motion into a game: follow the beat, aim at a virtual hoop and see how many points you can earn.",
    challenge:
      "The game needs to know when someone is taking a shot, rather than just moving. The music, targets and score also have to agree on exactly when that shot happened.",
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
    image: "/images/photo-mosaic-concept.webp",
    alt: "InMoment photo mosaic display with a grid of guest photos and a nearby mobile selfie station, concept visualization",
    title: "Individual faces. One shared picture.",
    eyebrow: "Live photo mosaic",
    summary: "Mobile selfies become a growing, shared event display.",
    categories: ["Photo", "Web", "Installation"],
    status: "Experience design · Draft estimate",
    brief:
      "Give everyone a way to add their face to one shared picture, then email the finished mosaic after the event.",
    challenge:
      "Photos arrive from different phones and at different times. They need to face the right way, fit the grid and reach the display in order, including after a connection drops.",
    experience:
      "Guests scan a QR code, enter their details, capture and review a selfie, then submit it. Each image joins a predefined grid on the event display. A final mosaic export is prepared for email delivery after the event.",
    flow: [
      "Scan event QR",
      "Capture and review",
      "Submit the photo",
      "Watch the picture grow",
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
    image: "/images/spatial-selfie-concept.webp",
    alt: "Custom InMoment capture kiosk beside a separate framed spatial portrait display, concept visualization",
    title: "A selfie with another dimension.",
    eyebrow: "Spatial selfie experience",
    summary:
      "A selfie experience with payment, a composited photo and a private QR download.",
    categories: ["Spatial", "Photo", "Event Technology"],
    status: "Experience design · Ballpark proposal",
    brief:
      "Make it easy for a guest to pay, create a selfie with a spatial display and take the finished image away on their phone.",
    challenge:
      "A completed purchase should open one photo session. If someone cancels, loses connection or runs out of time, the next step needs to be clear without charging or unlocking twice.",
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
];
const order = [
  "ai-portrait-experience",
  "environmental-ar-mirror",
  "live-photo-mosaic",
  "spatial-selfie-experience",
  "rhythm-shooting-challenge",
];
export const publishedStudies = studies
  .filter((s) => s.visibility === "published")
  .sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug));
