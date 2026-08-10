export const CERTIFICATE = {
  organization: "RAKVIH FOUNDATION",

  title: "CERTIFICATE OF COMPLETION",

  subtitle:
    "This certificate is proudly presented to",

  description: (
    studentName: string,
    programName: string
  ) =>
    `This is to certify that ${studentName} has successfully completed the ${programName} Internship Program conducted by RAKVIH FOUNDATION with dedication, commitment, and outstanding performance.`,

  footer:
    "We appreciate your hard work and wish you continued success in your career.",

  colors: {
    primary: "#F4B400",
    secondary: "#2E7D32",
    text: "#222222",
    light: "#666666",
    border: "#D4AF37",
  },

  fonts: {
    title: 28,
    subtitle: 18,
    name: 32,
    body: 14,
    footer: 12,
  },

  page: {
    width: 842,
    height: 595,
    margin: 40,
  },
};