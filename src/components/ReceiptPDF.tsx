import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const COLORS = {
  olive: "#798321",
  oliveDark: "#5E6919",
  yellow: "#E9C94A",
  yellowLight: "#FFF9DB",
  white: "#FFFFFF",
  bg: "#F8FAFC",
  text: "#111827",
  gray: "#6B7280",
  border: "#E5E7EB",
  success: "#16A34A",
  successBg: "#DCFCE7",
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.bg,
    paddingTop: 14,
    paddingBottom: 14,
    paddingHorizontal: 18,
    fontFamily: "Helvetica",
    fontSize: 8,
    color: COLORS.text,
  },

  /* ================= HEADER ================= */

  header: {
    backgroundColor: COLORS.olive,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.yellow,
    justifyContent: "center",
    alignItems: "center",
  },

  logoText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.oliveDark,
  },

  companyArea: {
    flex: 1,
    marginLeft: 10,
  },

  company: {
    fontSize: 15,
    color: COLORS.white,
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: 7,
    color: "#EEF6D6",
    marginTop: 2,
  },

  receipt: {
    textAlign: "center",
    color: COLORS.white,
    marginTop: 8,
    fontSize: 11,
    fontWeight: "bold",
  },

  yellowBar: {
    height: 2,
    backgroundColor: COLORS.yellow,
    marginTop: 8,
    borderRadius: 10,
  },

  /* ================= RECEIPT DETAILS ================= */

  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  receiptCard: {
    width: "48%",
    backgroundColor: COLORS.white,
    border: `1 solid ${COLORS.border}`,
    borderRadius: 6,
    padding: 8,
  },

  smallLabel: {
    fontSize: 7,
    color: COLORS.gray,
  },

  smallValue: {
    fontSize: 8,
    fontWeight: "bold",
    marginTop: 2,
  },

  /* ================= TWO COLUMN ================= */

  columns: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  column: {
    width: "49%",
  },

  card: {
    backgroundColor: COLORS.white,
    border: `1 solid ${COLORS.border}`,
    borderRadius: 8,
    padding: 8,
  },

  sectionTitle: {
    color: COLORS.olive,
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 2,
  },

  sectionLine: {
    height: 2,
    width: 35,
    backgroundColor: COLORS.yellow,
    marginBottom: 6,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
    borderBottom: "1 solid #F3F4F6",
  },

  label: {
    fontSize: 7,
    color: COLORS.gray,
  },

  value: {
    fontSize: 8,
    fontWeight: "bold",
    color: COLORS.text,
  },

  amountCard: {
    marginTop: 8,
    backgroundColor: COLORS.yellowLight,
    border: `1 solid ${COLORS.yellow}`,
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },

  amountTitle: {
    fontSize: 8,
    color: COLORS.gray,
  },

  amount: {
    fontSize: 18,
    color: COLORS.olive,
    fontWeight: "bold",
    marginTop: 3,
  },

  success: {
    marginTop: 8,
    backgroundColor: COLORS.successBg,
    color: COLORS.success,
    textAlign: "center",
    paddingVertical: 5,
    borderRadius: 20,
    fontSize: 8,
    fontWeight: "bold",
  },

  footer: {
    marginTop: 8,
    borderTop: `1 solid ${COLORS.border}`,
    paddingTop: 6,
    textAlign: "center",
  },

  footerTitle: {
    color: COLORS.olive,
    fontSize: 8,
    fontWeight: "bold",
  },

  footerText: {
    fontSize: 6,
    color: COLORS.gray,
    marginTop: 2,
  },
});

type Props = {
  enrollment: any;
  payment: any;
  program: any;
};

export default function ReceiptPDF({
  enrollment,
  payment,
  program,
}: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
                {/* ================= HEADER ================= */}

        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>R</Text>
            </View>

            <View style={styles.companyArea}>
              <Text style={styles.company}>
                RAKVIH FOUNDATION
              </Text>

              <Text style={styles.subtitle}>
                Professional Internship & Training Portal
              </Text>
            </View>
          </View>

          <Text style={styles.receipt}>
            PAYMENT RECEIPT
          </Text>

          <View style={styles.yellowBar} />
        </View>

        {/* ================= RECEIPT DETAILS ================= */}

        <View style={styles.receiptRow}>
          <View style={styles.receiptCard}>
            <Text style={styles.smallLabel}>
              Receipt No.
            </Text>

            <Text style={styles.smallValue}>
              RCPT-{payment?.id || "000001"}
            </Text>
          </View>

          <View style={styles.receiptCard}>
            <Text style={styles.smallLabel}>
              Payment Date
            </Text>

            <Text style={styles.smallValue}>
              {payment?.created_at
                ? new Date(payment.created_at).toLocaleDateString("en-IN")
                : new Date().toLocaleDateString("en-IN")}
            </Text>
          </View>
        </View>

        {/* ================= STUDENT + COURSE ================= */}

        <View style={styles.columns}>

          {/* STUDENT */}

          <View style={styles.column}>
            <View style={styles.card}>

              <Text style={styles.sectionTitle}>
                STUDENT DETAILS
              </Text>

              <View style={styles.sectionLine} />

              <View style={styles.row}>
                <Text style={styles.label}>Name</Text>
                <Text style={styles.value}>
                  {enrollment?.full_name || "-"}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>
                  {enrollment?.email || "-"}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Phone</Text>
                <Text style={styles.value}>
                  {enrollment?.phone || "-"}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>College</Text>
                <Text style={styles.value}>
                  {enrollment?.college || "-"}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Branch</Text>
                <Text style={styles.value}>
                  {enrollment?.branch || "-"}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Year</Text>
                <Text style={styles.value}>
                  {enrollment?.year || "-"}
                </Text>
              </View>

            </View>
          </View>

          {/* COURSE */}

          <View style={styles.column}>
            <View style={styles.card}>

              <Text style={styles.sectionTitle}>
                COURSE DETAILS
              </Text>

              <View style={styles.sectionLine} />

              <View style={styles.row}>
                <Text style={styles.label}>Course</Text>
                <Text style={styles.value}>
                  {program?.title || "-"}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Category</Text>
                <Text style={styles.value}>
                  {program?.category || "-"}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Duration</Text>
                <Text style={styles.value}>
                  {program?.duration || "-"}
                </Text>
              </View>
                            <View style={styles.row}>
                <Text style={styles.label}>Program ID</Text>
                <Text style={styles.value}>
                  {program?.id || "-"}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Fee</Text>
                <Text style={styles.value}>
                  ₹{payment?.amount || 0}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Admission</Text>
                <Text style={styles.value}>
                  Confirmed
                </Text>
              </View>

            </View>
          </View>

        </View>

        {/* ================= PAYMENT DETAILS ================= */}

        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            PAYMENT DETAILS
          </Text>

          <View style={styles.sectionLine} />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >

            {/* Left */}

            <View style={{ width: "49%" }}>

              <View style={styles.row}>
                <Text style={styles.label}>
                  Amount
                </Text>

                <Text style={styles.value}>
                  ₹{payment?.amount || 0}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>
                  Status
                </Text>

                <Text style={styles.value}>
                  {payment?.payment_status || "Success"}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>
                  Method
                </Text>

                <Text style={styles.value}>
                  {payment?.payment_method || "-"}
                </Text>
              </View>

            </View>

            {/* Right */}

            <View style={{ width: "49%" }}>

              <View style={styles.row}>
                <Text style={styles.label}>
                  Transaction ID
                </Text>

                <Text style={styles.value}>
                  {payment?.transaction_id || "-"}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>
                  Date
                </Text>

                <Text style={styles.value}>
                  {payment?.created_at
                    ? new Date(payment.created_at).toLocaleDateString("en-IN")
                    : "-"}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>
                  Time
                </Text>

                <Text style={styles.value}>
                  {payment?.created_at
                    ? new Date(payment.created_at).toLocaleTimeString("en-IN")
                    : "-"}
                </Text>
              </View>

            </View>

          </View>
        </View>
                {/* ================= PAYMENT SUMMARY ================= */}

        <View style={styles.amountCard}>
          <Text style={styles.amountTitle}>
            TOTAL AMOUNT PAID
          </Text>

          <Text style={styles.amount}>
            ₹{payment?.amount || 0}
          </Text>
        </View>

        {/* ================= SUCCESS ================= */}

        <Text style={styles.success}>
          ✓ PAYMENT SUCCESSFUL
        </Text>

        {/* ================= NOTES ================= */}

        <View
          style={{
            marginTop: 8,
            backgroundColor: "#FFFFFF",
            border: "1 solid #E5E7EB",
            borderRadius: 8,
            padding: 8,
          }}
        >
          <Text
            style={{
              fontSize: 8,
              color: "#798321",
              fontWeight: "bold",
              marginBottom: 4,
            }}
          >
            Important Note
          </Text>

          <Text
            style={{
              fontSize: 7,
              color: "#6B7280",
              lineHeight: 1.4,
            }}
          >
            • This is a computer-generated receipt.
            {"\n"}
            • Keep this receipt for future reference.
            {"\n"}
            • Payment once completed is recorded successfully.
            {"\n"}
            • Contact RAKVIH Foundation support for any payment-related queries.
          </Text>
        </View>

        {/* ================= FOOTER ================= */}

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>
            RAKVIH FOUNDATION
          </Text>

          <Text style={styles.footerText}>
            Professional Internship & Training Portal
          </Text>

          <Text style={styles.footerText}>
            www.rakvih.com | support@rakvih.com
          </Text>

          <Text style={styles.footerText}>
            © {new Date().getFullYear()} RAKVIH Foundation. All Rights Reserved.
          </Text>

          <Text style={styles.footerText}>
            This receipt is system generated and does not require a signature.
          </Text>
        </View>
        </Page>
</Document>
);
}
