import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

// Register a clean font
Font.register({
  family: "Helvetica",
  fonts: [
    { src: "https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica.ttf", fontWeight: "normal" },
    { src: "https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica-Bold.ttf", fontWeight: "bold" },
  ],
});

const styles = StyleSheet.create({
  page: { padding: 36, fontFamily: "Helvetica", fontSize: 10, color: "#1a1a1a", lineHeight: 1.4 },
  header: { marginBottom: 12, borderBottom: "2px solid #2563eb", paddingBottom: 8 },
  name: { fontSize: 22, fontWeight: "bold", color: "#111827", marginBottom: 4 },
  contactRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, fontSize: 9, color: "#4b5563" },
  contactItem: { marginRight: 12 },
  sectionTitle: { fontSize: 12, fontWeight: "bold", color: "#2563eb", marginTop: 12, marginBottom: 4, borderBottom: "1px solid #e5e7eb", paddingBottom: 2 },
  objective: { fontSize: 10, color: "#374151", marginBottom: 4 },
  entryHeader: { flexDirection: "row", justifyContent: "space-between", marginTop: 6, marginBottom: 2 },
  entryTitle: { fontSize: 10, fontWeight: "bold", color: "#111827" },
  entrySubtitle: { fontSize: 9, color: "#6b7280" },
  bullet: { flexDirection: "row", marginLeft: 12, marginBottom: 2 },
  bulletDot: { width: 8, fontSize: 10 },
  bulletText: { flex: 1, fontSize: 9.5, color: "#374151" },
  skillsRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 2 },
  skillCategory: { fontWeight: "bold", fontSize: 9.5, color: "#111827", marginRight: 4 },
  skillItems: { fontSize: 9.5, color: "#374151" },
  certItem: { fontSize: 9.5, color: "#374151", marginBottom: 2, marginLeft: 12 },
});

export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  linkedin?: string;
  github?: string;
  location?: string;
  objective?: string;
  education: { degree: string; institution: string; year: string; gpa?: string }[];
  experience: { title: string; company: string; duration: string; bullets: string[] }[];
  projects: { name: string; tech: string; bullets: string[] }[];
  skills: { languages?: string[]; frameworks?: string[]; tools?: string[]; soft_skills?: string[] };
  certifications?: string[];
  achievements?: string[];
}

const ResumePDF = ({ data }: { data: ResumeData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{data.name}</Text>
        <View style={styles.contactRow}>
          {data.email && <Text style={styles.contactItem}>{data.email}</Text>}
          {data.phone && <Text style={styles.contactItem}>{data.phone}</Text>}
          {data.location && <Text style={styles.contactItem}>{data.location}</Text>}
          {data.linkedin && <Text style={styles.contactItem}>{data.linkedin}</Text>}
          {data.github && <Text style={styles.contactItem}>{data.github}</Text>}
        </View>
      </View>

      {/* Objective */}
      {data.objective && (
        <>
          <Text style={styles.sectionTitle}>PROFESSIONAL SUMMARY</Text>
          <Text style={styles.objective}>{data.objective}</Text>
        </>
      )}

      {/* Education */}
      {data.education?.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>EDUCATION</Text>
          {data.education.map((edu, i) => (
            <View key={i}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{edu.degree}</Text>
                <Text style={styles.entrySubtitle}>{edu.year}</Text>
              </View>
              <Text style={styles.entrySubtitle}>
                {edu.institution}{edu.gpa ? ` | GPA: ${edu.gpa}` : ""}
              </Text>
            </View>
          ))}
        </>
      )}

      {/* Experience */}
      {data.experience?.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>EXPERIENCE</Text>
          {data.experience.map((exp, i) => (
            <View key={i}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{exp.title} — {exp.company}</Text>
                <Text style={styles.entrySubtitle}>{exp.duration}</Text>
              </View>
              {exp.bullets.map((b, j) => (
                <View key={j} style={styles.bullet}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{b}</Text>
                </View>
              ))}
            </View>
          ))}
        </>
      )}

      {/* Projects */}
      {data.projects?.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>PROJECTS</Text>
          {data.projects.map((proj, i) => (
            <View key={i}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{proj.name}</Text>
                <Text style={styles.entrySubtitle}>{proj.tech}</Text>
              </View>
              {proj.bullets.map((b, j) => (
                <View key={j} style={styles.bullet}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{b}</Text>
                </View>
              ))}
            </View>
          ))}
        </>
      )}

      {/* Skills */}
      {data.skills && (
        <>
          <Text style={styles.sectionTitle}>SKILLS</Text>
          {data.skills.languages?.length ? (
            <View style={styles.skillsRow}>
              <Text style={styles.skillCategory}>Languages:</Text>
              <Text style={styles.skillItems}>{data.skills.languages.join(", ")}</Text>
            </View>
          ) : null}
          {data.skills.frameworks?.length ? (
            <View style={styles.skillsRow}>
              <Text style={styles.skillCategory}>Frameworks:</Text>
              <Text style={styles.skillItems}>{data.skills.frameworks.join(", ")}</Text>
            </View>
          ) : null}
          {data.skills.tools?.length ? (
            <View style={styles.skillsRow}>
              <Text style={styles.skillCategory}>Tools:</Text>
              <Text style={styles.skillItems}>{data.skills.tools.join(", ")}</Text>
            </View>
          ) : null}
          {data.skills.soft_skills?.length ? (
            <View style={styles.skillsRow}>
              <Text style={styles.skillCategory}>Soft Skills:</Text>
              <Text style={styles.skillItems}>{data.skills.soft_skills.join(", ")}</Text>
            </View>
          ) : null}
        </>
      )}

      {/* Certifications */}
      {data.certifications?.length ? (
        <>
          <Text style={styles.sectionTitle}>CERTIFICATIONS</Text>
          {data.certifications.map((c, i) => (
            <Text key={i} style={styles.certItem}>• {c}</Text>
          ))}
        </>
      ) : null}

      {/* Achievements */}
      {data.achievements?.length ? (
        <>
          <Text style={styles.sectionTitle}>ACHIEVEMENTS</Text>
          {data.achievements.map((a, i) => (
            <Text key={i} style={styles.certItem}>• {a}</Text>
          ))}
        </>
      ) : null}
    </Page>
  </Document>
);

export default ResumePDF;
