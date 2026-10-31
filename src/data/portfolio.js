export const profile = {
  name: "Marcel Hofmann",
  firstName: "Marcel",
  email: "marcel@hofmann-owl.de",
  github: "https://github.com/soosmann",
  linkedin: "https://linkedin.com/in/marcel-hofmann",
};

export const sections = [
  {
    id: "intro",
    type: "intro",
    navLabel: "Home",
    enabled: true,
    description:
      "Welcome to my website. I build software and mobile experiences, focusing on deep learning projects. I'm currently working on Limpio, a photo gallery cleaning app powered by deep learning.",
    portrait: {
      src: "/assets/skybar_photo.png",
      alt: "Marcel Hofmann's graduation portrait, rendered in ASCII characters",
      isPlaceholder: false,
    },
  },
  {
    id: "about",
    type: "about",
    navLabel: "About",
    title: "about me",
    enabled: true,
    paragraphs: [
      "I'm Marcel Hofmann, and I recently completed my master's degree at the Universidad Autónoma de Madrid. Most of my work brings together deep learning and mobile development, from training models to building the interfaces people use.",
      "These days, I'm building Limpio, a mobile app for cleaning up photo galleries, and learning about reinforcement learning.",
      "In my free time, I enjoy playing padel, running, and going to the gym. I also like learning languages."
    ],
    technologyIntro: "Some of the technologies I'm working with:",
    technologies: ["PyTorch", "TorchVision", "Flutter", "SQL", "Git", "Optuna"],
    photo: {
      src: "/assets/uam_graduation_portrait.jpeg",
      alt: "Photo of Marcel Hofmann",
      isPlaceholder: false,
    },
  },
  {
    id: "experience",
    type: "experience",
    navLabel: "Experience",
    title: "experience",
    enabled: true,
    items: [
      {
        id: "dspace",
        company: "dSPACE",
        role: "Student Assistant for AI Research",
        period: "December 2024 - August 2025",
        isPlaceholder: false,
        description: [
          "Conducted an independent research project on LLM fine-tuning for structured traffic-scenario generation and its application to RAG.",
          "Built a multi-GPU training and LoRA fine-tuning pipeline using PyTorch, Hugging Face, Hydra, and CometML, including a Streamlit UI for configuring and monitoring experiments.",
          "Fine-tuned Qwen2.5 and Llama 3 models and developed an encoder-decoder transformer with a custom tokenizer, achieving a 10x speedup in traffic scenario generation.",
          "Curated data and conducted initial training experiments for an LLM used as an internal company chatbot."
        ],
      },
      {
        id: "deutsche-telekom",
        company: "Deutsche Telekom IT",
        role: "Dual Student in Business Informatics",
        period: "October 2021 - September 2024",
        isPlaceholder: false,
        description: [
          "Developed software in an Agile/Scrum environment as part of my dual study program, first in a blockchain and Self-Sovereign Identity (SSI) team and later in a team developing machine learning applications.",
          "Implemented training and daily prediction pipelines for the Customer Intent Prediction project using transformer-based models, PyTorch, NumPy, Docker, Kubeflow, and PostgreSQL.",
          "Wrote my bachelor's thesis on the Customer Intent Prediction project, successfully training and evaluating a vanilla transformer, the Temporal Fusion Transformer, and a transformer with a BERT encoder."
        ],
      },
    ],
  },
  {
    id: "projects",
    type: "projects",
    navLabel: "Software projects",
    title: "software projects",
    enabled: true,
    items: [
      {
        id: "imitation-learning",
        title: "Imitation Learning Using Flow Matching",
        video: {
          src: "/assets/projects/flow_matching.mp4",
          alt: "Push-T demonstration using Flow Matching.",
        },
        description:
          "A small reinforcement learning project exploring imitation learning using a simple MSE policy and flow matching.",
        technologies: ["PyTorch", "Gymnasium", "Matplotlib"],
        github: "https://github.com/soosmann/imitation_learning",
      },
      {
        id: "master-thesis",
        title: "Master's Thesis Implementation",
        image: {
          src: "/assets/projects/master_thesis.png",
          alt: "Master's thesis project preview",
          isPlaceholder: false,
        },
        description:
          "Investigated whether and how neural scaling laws can complement learning curve extrapolation. Trained Learning Curve Prior-Data Fitted Networks (LC-PFNs), which use a transformer architecture incorporating Bayesian inference, and used them in hyperparameter optimization to stop unpromising training runs early.",
        technologies: ["PyTorch", "NumPy", "TorchVision", "SciPy", "Optuna", "Matplotlib", "Hydra"],
        github: "https://github.com/soosmann/tfm-complete",
      },
      
      {
        id: "pedestrian-tracking",
        title: "Pedestrian Multi-Object Tracking Using MOT16",
        video: {
          src: "/assets/projects/pedestrian_tracking.mp4",
          alt: "Pedestrian multi-object tracking demonstration on MOT16",
        },
        description:
          "Tracks multiple pedestrians simultaneously using the MOT16 dataset. The implementation uses the ByteTrack and ReID algorithms, a Kalman filter, and a ResNet18 backbone. Includes an API for running inference on new videos.",
        technologies: ["PyTorch", "TorchVision", "OpenCV", "FastAPI"],
        github: "https://github.com/soosmann/lab-pedestrian-tracking",
      },
      {
        id: "transformer-deployment",
        title: "Transformer Deployment on AWS",
        description:
        "A project based on a Udemy course, covering transformer model training, an API for inference, a Streamlit interface, and the deployment of production-ready deep learning applications on AWS.",
        technologies: ["AWS", "Hugging Face", "FastAPI", "MLOps"],
        github: "https://github.com/soosmann/transformer-deployment-aws",
      },
      {
        id: "mundo",
        title: "Mundo",
        description:
        "A university software engineering project: a mobile app for documenting trips through a social network. Users can create accounts, follow friends, share trips through text and images, and discover other users' trips in a For You feed.",
        technologies: ["Flutter", "Firebase", "Google Maps API", "GitHub"],
        github: "https://github.com/soosmann/mundo",
      },
      {
        id: "portfolio-website",
        title: "Portfolio Website",
        description:
          "My home on the web. Built with React and Vite, with an interactive ASCII portrait and a configurable collection of sections that make it easy to keep my projects and experience up to date.",
        technologies: ["React", "Vite", "CSS"],
        github: "",
        url: "",
      },
      {
        id: "single-stage-object-detector",
        title: "Single Stage Object Detector",
        description:
          "Low-level implementation of a YOLO-style detector trained on the PASCAL VOC 2007 dataset. The implementation is based on a uni lab.",
        technologies: ["PyTorch", "TorchVision", "NumPy", "OpenCV"],
        github: "https://github.com/soosmann/lab-single-stage-object-detection",
      },
    ],
  },
  {
    id: "products",
    type: "product",
    navLabel: "Products",
    title: "products",
    enabled: true,
    items: [
      {
        id: "limpio",
        name: "Limpio",
        tagline: "Make Room for What Matters.",
        status: "In development",
        description:
          "A mobile app powered by deep learning for cleaning up your photo gallery. Limpio ranks photos by image quality and selects deletion candidates to help you decide what to keep. It prepares suggestions in the background, then notifies you to review them and delete photos.",
        features: [
          {
            title: "Photo quality assessment",
            description:
              "A neural network with a MobileCLIP backbone, trained on a self-created dataset for image-quality assessment.",
          },
          {
            title: "Built for mobile",
            description:
              "Model quantization and pruning, with on-device learning and a Flutter interface.",
          },
        ],
        technologies: ["Flutter", "MobileCLIP", "Drift SQL", "Firebase"],
        screenshot: {
          src: "/assets/products/limpio.png",
          alt: "Limpio app screenshot",
          isPlaceholder: false,
        },
        links: [{ label: "Visit Limpio", url: "https://limpio-app.com" }],
      },
    ],
  },
];
