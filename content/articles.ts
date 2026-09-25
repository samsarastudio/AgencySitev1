export type ArticleSection = {
  heading: string;
  paragraphs: string[];
  items?: string[];
};
export type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
  published: string;
  updated?: string;
  image: string;
  imageAlt: string;
  imageCaption?: string;
  sections: ArticleSection[];
  draft?: boolean;
  body?: string;
  metaDescription?: string;
  publishedAt?: string;
};
const photo = "/images/setup-magnet-booth.webp";
const defaults = {
  author: "InMoment Team",
  published: "2026-09-25",
  image: photo,
  imageAlt: "FrameFlix magnet and photo booth product imagery",
  imageCaption: "FrameFlix product imagery",
};
export const articles: Article[] = [
  {
    ...defaults,
    slug: "experiential-ai",
    title: "Planning an AI portrait activation",
    description:
      "The creative treatment is only one part of the experience. Plan the guest journey, consent, generation and delivery together.",
    category: "Experiential AI",
    tags: ["AI", "portraits", "planning"],
    image: "/images/ai-portrait-kiosk.webp",
    imageAlt: "Unbranded racing portrait experience concept",
    imageCaption: "Concept visualization",
    sections: [
      {
        heading: "Begin with the output",
        paragraphs: [
          "Start with the picture you want someone to take home. Are you putting their face into an approved scene, or asking AI to create something more open-ended? Those need different builds. A few sample images help everyone agree on what stays fixed and what changes for each guest.",
          "Build a representative set of test outputs early. Review framing, lighting, face placement and the space needed for approved event graphics. Creative approval and technical testing should happen together.",
        ],
      },
      {
        heading: "Separate capture review from generation",
        paragraphs: [
          "Give guests a clear point to review their camera photo before processing begins. A camera retake and an AI regeneration have different effects on cost, waiting time and the kiosk journey. Label the actions so the guest knows which step they are confirming.",
          "If the final image appears at the kiosk, account for the time a guest spends waiting and reviewing. If delivery happens away from the station, explain that handoff before they leave. Neither approach should be selected without considering the event flow.",
        ],
      },
      {
        heading: "Design the delivery path",
        paragraphs: [
          "Connect the accepted photo, creative choice, consent and output to the same session. Plan for delayed processing, a failed email or a print job that needs attention. A simple operator view can be more useful at an event than a large dashboard.",
          "Ask who approves participant consent, what information is required, how long media is retained and who handles deletion requests. These decisions belong in the production brief. Confirm the appropriate requirements with the event owner and its advisors.",
        ],
        items: [
          "Test with the final camera, kiosk and network.",
          "Define retries and what the operator can change.",
          "Keep email delivery and printing associated with the same guest.",
          "Agree on a fallback before event day.",
        ],
      },
    ],
  },
  {
    ...defaults,
    slug: "designing-for-throughput",
    title: "Design the queue, not just the screen",
    description:
      "Look at the whole interaction when planning how guests move through an activation.",
    category: "Production",
    tags: ["throughput", "kiosks", "planning"],
    image: "/images/gesture-basketball-concept-v2.webp",
    imageAlt: "Gesture game concept in an event space",
    imageCaption: "Concept visualization",
    sections: [
      {
        heading: "Map the complete guest journey",
        paragraphs: [
          "A fast piece of software does not automatically make a fast activation. The journey also includes the invitation, explanation, positioning, consent, capture, review and exit. Walk through each step as a first-time guest.",
          "Record where someone needs help or hesitates. A clear standing mark, a short tutorial or an attendant prompt can change the flow as much as a faster processing step. Keep the next action visible.",
        ],
      },
      {
        heading: "Measure the slowest handoff",
        paragraphs: [
          "Ask someone who hasn’t seen the booth before to try it, and time the whole visit. Include choosing a style, reading the instructions and collecting the photo. Use the equipment you plan to take to the event so the timing means something.",
          "Treat expected processing times as estimates until tested in the intended conditions. Network services, camera behavior, printers and participant choices all introduce variation. Use the observed range when discussing capacity; avoid presenting a theoretical maximum as a guarantee.",
        ],
      },
      {
        heading: "Give recovery its own path",
        paragraphs: [
          "A lost tracking signal, paper issue or interrupted upload should have an understandable next step. Decide whether a session resumes, retries or returns to the ready screen. Keep the operator’s intervention simple.",
          "Where the format allows it, separate arrival, active participation and collection. Confirm that any second station or output area actually fits the venue. The right flow is the one the team can run in the room, with the equipment and staffing in scope.",
        ],
      },
    ],
  },
  {
    ...defaults,
    slug: "sticker-studio-vs-custom-frames",
    title: "Sticker Studio or custom frames?",
    description:
      "Choose the guest keepsake around your occasion, audience and event flow.",
    category: "Photo Experiences",
    tags: ["stickers", "magnets", "planning"],
    author: "FrameFlix Team",
    published: "2026-03-20",
    updated: "2026-09-25",
    image: "/images/stickers-hero.webp",
    imageAlt: "Existing FrameFlix sample stickers and cutouts",
    sections: [
      {
        heading: "A photo that becomes a keepsake",
        paragraphs: [
          "Custom fridge-magnet frames give guests a finished object to take home. With FrameFlix, the photo is paired with a nameplate carrying your event names, date or approved logo. The current frame palette includes blush, cream, mint and baby blue.",
          "For a wedding, birthday or team celebration, those little details make the photo feel like part of the day. Send us your colours and wording early so the frame, nameplate and print look right together.",
        ],
      },
      {
        heading: "A live sticker experience",
        paragraphs: [
          "Sticker Studio prints and cuts photo stickers, labels and event favours on site. Smart subject cutouts allow the format to follow the person or object in the image. The station can be booked on its own or alongside fridge magnets.",
          "Choose a format before estimating quantities. Sticker size, guest count and the coverage window inform the recommended setup. Ask to see samples and confirm the finish in your quote.",
        ],
      },
      {
        heading: "Combining the two",
        paragraphs: [
          "Use the event schedule to decide whether both experiences belong together. A sticker station during mingling and a photo-magnet experience later may serve different parts of the evening, but the staffing and space should be planned as one booking.",
          "Send the event date, city, guest count and the formats you are considering. FrameFlix will confirm the package, quantities and logistics in a custom quote.",
        ],
      },
    ],
  },
  {
    ...defaults,
    slug: "when-to-schedule-photobooth-reception",
    title: "When should the photo booth open?",
    description:
      "Fit the photo experience around speeches, food, dancing and the moments your guests already share.",
    category: "Photo Experiences",
    tags: ["weddings", "timeline", "planning"],
    author: "FrameFlix Team",
    published: "2026-03-01",
    updated: "2026-09-25",
    sections: [
      {
        heading: "Choose a natural pause",
        paragraphs: [
          "Cocktail hour gives guests something to do while they mingle. The period after dinner and speeches can offer another natural opportunity. Think about where guests will be, what else is happening and how visible the booth will be from that area.",
          "Avoid placing the only photo opportunity directly against an important shared moment such as a first dance. Ask your planner to include the booth window in the same schedule used by the venue and entertainment team.",
        ],
      },
      {
        heading: "Keep setup outside the experience",
        paragraphs: [
          "FrameFlix Essential and Premium packages include three hours of active booth coverage. Setup and teardown are outside that window, and an attendant runs the booth. Signature coverage is tailored in the written quote.",
          "Confirm venue access, available space and power before finalizing the schedule. Tell the team about stairs, loading restrictions or a room change so those details can be planned.",
        ],
      },
      {
        heading: "Plan around the actual guest count",
        paragraphs: [
          "Tell us roughly how many people are coming and how many keepsakes you’d like. The number of digital photos and the number of physical frames are separate parts of your package. We’ll look at both alongside the evening’s schedule.",
          "Ask about extra coverage or frames if the event changes. A written update keeps the planner, attendant and host working from the same expectations.",
        ],
      },
    ],
  },
  {
    ...defaults,
    slug: "corporate-event-branded-photobooth-ideas",
    title: "Branded keepsakes for a company event",
    description:
      "Bring the event identity into photos, magnets and stickers without overwhelming the guest’s picture.",
    category: "Photo Experiences",
    tags: ["corporate", "branding", "events"],
    author: "FrameFlix Team",
    published: "2026-02-05",
    updated: "2026-09-25",
    sections: [
      {
        heading: "Give the guest room in the design",
        paragraphs: [
          "A branded keepsake should still feel like the guest’s photo. Use an approved logo, event title or short message in the nameplate or frame treatment, with enough space for the image to remain the focus.",
          "Share brand guidance and any restrictions before artwork is prepared. Review spelling, logo placement and colours in the proof before production.",
        ],
      },
      {
        heading: "Match the format to the event",
        paragraphs: [
          "Fridge magnets can mark a team celebration, milestone or holiday event. Stickers offer another format for a mixer or activation. FrameFlix can quote either experience or a combination, with the design considered across the selected outputs.",
          "For digital sharing, agree on the gallery access and any QR destination. Keep the guest-facing instructions short and easy to follow.",
        ],
      },
      {
        heading: "Brief the operation as well as the artwork",
        paragraphs: [
          "Include the venue, date, guest count and active coverage window. Tell the team if the experience needs to move between spaces or fit a particular agenda. Attendant-led operation and setup should be coordinated with the event producer.",
          "Get a quote for the format and quantities you actually need. If your team also wants to measure sharing or participation, bring that up early so it can be planned into the experience.",
        ],
      },
    ],
  },
  {
    ...defaults,
    slug: "personalized-keepsakes-vs-paper-strips",
    title: "Choosing a photo keepsake guests can display",
    description:
      "Think about the format, personalization and the place a guest might put their finished photo.",
    category: "Photo Experiences",
    tags: ["keepsakes", "magnets", "weddings"],
    author: "FrameFlix Team",
    published: "2025-11-15",
    updated: "2026-09-25",
    image: "/images/magnet-fridge.webp",
    imageAlt: "FrameFlix pink photo magnet on a refrigerator",
    sections: [
      {
        heading: "Start with where it goes",
        paragraphs: [
          "A photo strip, a print and a fridge magnet each offer a different way to keep an event photo. The right choice depends on the occasion and what you want to hand to each guest. A magnet frame is ready to display on a suitable surface.",
          "FrameFlix pairs a photo from the DSLR booth with a custom fridge-magnet frame and event nameplate. The physical format is part of the experience, from picking up the print to taking the finished piece home.",
        ],
      },
      {
        heading: "Make the personalization useful",
        paragraphs: [
          "Names, an event date or a short message can connect the keepsake to the occasion. A logo can serve the same role at a company event. Keep the wording legible and confirm it in a proof before production.",
          "The current palette includes blush, cream, mint and baby blue. Ask for samples if material, colour or finish is important to your decision.",
        ],
      },
      {
        heading: "Agree on care and quantities",
        paragraphs: [
          "A keepsake still needs a little care. Follow the guidance that comes with your print and frame, and ask if you’re unsure where to display it or how to clean it.",
          "Confirm the number of physical frames separately from digital gallery access. Essential and Premium offer defined quantities; Signature packages are tailored to the event.",
        ],
      },
    ],
  },
  {
    ...defaults,
    slug: "dye-sublimation-photobooth-prints-explained",
    title: "Planning the printed side of a photo experience",
    description:
      "What to ask about print quality, quantities, collection and care when planning an event booth.",
    category: "Photo Experiences",
    tags: ["printing", "quality", "production"],
    author: "FrameFlix Team",
    published: "2026-01-10",
    updated: "2026-09-25",
    image: "/images/setup-instant-print.webp",
    imageAlt: "FrameFlix print station and magnet product display",
    sections: [
      {
        heading: "Look at the finished product",
        paragraphs: [
          "FrameFlix packages use dye-sublimation photo prints. Ask to see a sample in the intended frame or magnet so you can judge the finish, crop and design together. It helps to hold the finished piece in your hand, too.",
          "Review the artwork at its final output size. Important faces, text and branding need enough space from the crop and frame edge.",
        ],
      },
      {
        heading: "Plan the output workflow",
        paragraphs: [
          "A photo needs to move from capture to print and then into the guest’s hands. Confirm who manages the print station, how a guest collects the right photo and how the frame or magnet is assembled.",
          "For automated experiences, define the print queue, retry behavior and operator controls. Test the actual computer, printer, driver and media combination before relying on the workflow at the event.",
        ],
      },
      {
        heading: "Set realistic expectations",
        paragraphs: [
          "Confirm physical print and frame quantities in the written quote. An unlimited digital-photo option does not mean unlimited physical keepsakes. Extra frames and coverage can be discussed as part of the booking.",
          "Care and durability depend on the product and its environment. Keep prints and frames away from conditions the supplier advises against, and download digital copies before the agreed gallery access ends.",
        ],
      },
    ],
  },
  {
    ...defaults,
    slug: "wedding-guest-favors-guests-actually-keep",
    title: "Wedding favours with a personal connection",
    description:
      "Build the favour around a shared moment, a family detail or something guests can use.",
    category: "Photo Experiences",
    tags: ["weddings", "guest favours", "planning"],
    author: "FrameFlix Team",
    published: "2025-12-01",
    updated: "2026-09-25",
    image: "/images/magnet-hero-pink.webp",
    imageAlt: "Pink FrameFlix photo magnet product example",
    sections: [
      {
        heading: "Choose a connection to the day",
        paragraphs: [
          "Think about what makes the day yours. A reception photo, a family recipe or a locally made treat can give guests a small reminder of sharing it with you.",
          "Think about the way guests will receive it. An activity-based favour needs time in the schedule; a table gift needs to travel home easily.",
        ],
      },
      {
        heading: "Consider a photo or sticker experience",
        paragraphs: [
          "A custom photo-magnet frame pairs the guest’s portrait with a nameplate for the event. An on-site sticker station offers another format and can be quoted alone or with magnets. Both invite guests to take part in creating their keepsake.",
          "Coordinate the colours and wording with your other event details. Confirm spelling and artwork before production, and request samples if you want to compare formats.",
        ],
      },
      {
        heading: "Make the logistics part of the choice",
        paragraphs: [
          "Share the date, venue, guest count and coverage window with the supplier. Consider where guests queue and collect the finished item, and how the station fits around dinner and speeches.",
          "FrameFlix Essential and Premium include three active hours with an attendant, with setup and teardown outside that window. Confirm the physical frame count and online gallery period in your quote.",
        ],
      },
    ],
  },
  {
    ...defaults,
    slug: "choosing-a-photo-experience",
    title: "Choose the experience before chasing the trend",
    description:
      "A practical brief for comparing booth formats, custom sets, digital effects and physical keepsakes.",
    category: "Experiential Marketing",
    tags: ["planning", "formats", "photo"],
    image: "/images/booth-event.webp",
    imageAlt: "Existing FrameFlix ring-light booth product imagery",
    sections: [
      {
        heading: "Define what guests will do",
        paragraphs: [
          "Start with the interaction you want: a group pose, a short capture, a generated portrait or a physical keepsake. Describe that action in ordinary language before comparing equipment and software.",
          "Picture your guests using it. Will they want to pose as a group, try an effect or pick up a keepsake? Think about the space and any help people might need to join in. That’s a more useful starting point than what’s trending.",
        ],
      },
      {
        heading: "Compare a complete journey",
        paragraphs: [
          "Ask each supplier to explain arrival, participation, review, collection and sharing. Make sure the proposal distinguishes the core experience from optional treatments, outputs and support.",
          "A photo-strip aesthetic, a custom backdrop and an AI transformation are different production choices. Ask for a representative sample of the specific service being quoted. An inspiration image is not proof of available hardware or a finished installation.",
        ],
      },
      {
        heading: "Write a brief that can be answered",
        paragraphs: [
          "Include the objective, event date, location, guest count, budget range if available and the output you want guests to receive. Note any venue constraints and important brand requirements.",
          "Confirm the booking against a written scope. Review the equipment, staffing, output quantity, gallery period, setup window and any dependencies supplied by you or the venue.",
        ],
      },
    ],
  },
  {
    ...defaults,
    slug: "live-event-network-planning",
    title: "Treat the event network as part of the experience",
    description:
      "Make connectivity, recovery and delivery explicit in the technical brief.",
    category: "Production",
    tags: ["networks", "kiosks", "reliability"],
    image: "/images/ar-environment-concept-v2.webp",
    imageAlt: "Live display environment concept",
    imageCaption: "Concept visualization",
    sections: [
      {
        heading: "List what needs a connection",
        paragraphs: [
          "A locally rendered experience and its delivery workflow can have different network needs. Separate the steps that run on the station from those that depend on a remote service, such as payment, AI processing, uploads or email.",
          "Ask a simple question: if the internet drops, what can a guest still do? A screen might keep working while payment or email stops. The team needs to know the difference and how to explain it.",
        ],
      },
      {
        heading: "Test the intended setup",
        paragraphs: [
          "Confirm the connection type and access requirements with the venue. Test using the planned station, network and services. Include the time the system spends uploading media and waiting for a response.",
          "For multiple stations, consider how sessions and outputs are associated. Agree on a configuration approach so one station cannot accidentally receive another guest’s result.",
        ],
      },
      {
        heading: "Design reconnect and recovery",
        paragraphs: [
          "Decide which operations can safely retry. Repeating an upload, issuing another paid-session unlock and creating a duplicate print job are different actions with different consequences. The application should distinguish them.",
          "Write operator notes for the expected failure paths. Test interruption and recovery before the event so the team knows whether to resume, reset or ask for support.",
        ],
      },
    ],
  },
  {
    ...defaults,
    slug: "prototyping-interactive-installations",
    title: "What should an experience prototype prove?",
    description:
      "Use the first build to answer the technical question that could change the whole idea.",
    category: "Interactive Technology",
    tags: ["prototyping", "sensors", "interaction"],
    image: "/images/gesture-basketball-concept-v2.webp",
    imageAlt: "Gesture-controlled game concept",
    imageCaption: "Concept visualization",
    sections: [
      {
        heading: "Name the uncertainty",
        paragraphs: [
          "Can the camera separate a standing guest from the background? Can the intended gesture be recognized consistently? Does the display respond quickly enough for the interaction? A useful prototype begins with a specific question.",
          "Agree on what evidence will answer it. That might be representative capture footage, a set of generated outputs or a playable interaction tested with unfamiliar participants.",
        ],
      },
      {
        heading: "Build around the real constraints",
        paragraphs: [
          "Use production-equivalent hardware where the hardware affects the answer. A different camera, display resolution or lighting setup can change the result. Record what was tested and what still needs confirmation.",
          "Keep the creative scope focused. A rough interface with the correct sensor and timing can answer a feasibility question before final artwork and animation are ready.",
        ],
      },
      {
        heading: "Turn findings into a production decision",
        paragraphs: [
          "Come back to the question you started with. What worked, under what conditions, and what still needs a test? A useful prototype gives you a clearer next decision, even when the answer is to change the idea.",
          "Update the experience flow and scope around the findings. Confirm who supplies hardware, content, networking and event operations so the production plan reflects the actual responsibilities.",
        ],
      },
    ],
  },
];
export const publishedArticles = articles
  .filter((a) => !a.draft)
  .sort((a, b) => b.published.localeCompare(a.published));
export const readingTime = (a: Article) =>
  Math.max(
    1,
    Math.ceil(
      a.sections
        .flatMap((s) => [s.heading, ...s.paragraphs, ...(s.items || [])])
        .join(" ")
        .split(/\s+/).length / 200,
    ),
  );
export const headingId = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
