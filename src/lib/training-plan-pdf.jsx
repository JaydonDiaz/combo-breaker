import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { formatCurrency, formatDate, computeEndDate } from "./training-plan-types.js";

const PRIMARY = "#C41E3A";
const ACCENT  = "#D4AF37";
const LIGHT   = "#FFF8F8";
const BORDER  = "#FECDD3";
const GRAY    = "#6B7280";
const BLACK   = "#111827";

const s = StyleSheet.create({
  page: {
    paddingTop: 48, paddingBottom: 60, paddingHorizontal: 48,
    fontFamily: "Helvetica", fontSize: 10, color: BLACK, backgroundColor: "#FFFFFF",
  },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 28 },
  brandName: { fontFamily: "Helvetica-Bold", fontSize: 20, color: PRIMARY, letterSpacing: 1 },
  brandTagline: { fontSize: 9, color: GRAY, marginTop: 2 },
  brandContact: { fontSize: 8, color: GRAY, marginTop: 5, lineHeight: 1.5 },
  docLabel: { fontFamily: "Helvetica-Bold", fontSize: 22, color: ACCENT, letterSpacing: 2 },
  docSubLabel: { fontSize: 11, color: BLACK, marginTop: 4, textAlign: "right" },
  divider: { height: 2, backgroundColor: PRIMARY, marginBottom: 22 },
  twoCol: { flexDirection: "row", marginBottom: 24, gap: 16 },
  col: { flex: 1, backgroundColor: LIGHT, borderRadius: 4, padding: 14 },
  colLabel: { fontFamily: "Helvetica-Bold", fontSize: 8, color: PRIMARY, letterSpacing: 1.5, marginBottom: 8, textTransform: "uppercase" },
  colName: { fontFamily: "Helvetica-Bold", fontSize: 11, color: PRIMARY, marginBottom: 3 },
  colText: { fontSize: 9, color: GRAY, lineHeight: 1.7 },
  focusSection: { marginBottom: 22 },
  focusLabel: { fontFamily: "Helvetica-Bold", fontSize: 8, color: PRIMARY, letterSpacing: 1.5, marginBottom: 8, textTransform: "uppercase" },
  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  badge: { backgroundColor: PRIMARY, borderRadius: 3, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontFamily: "Helvetica-Bold", fontSize: 8, color: "#FFFFFF", letterSpacing: 0.5 },
  tableHeader: { flexDirection: "row", backgroundColor: PRIMARY, borderRadius: 3, paddingVertical: 7, paddingHorizontal: 10 },
  tableRow: { flexDirection: "row", paddingVertical: 8, paddingHorizontal: 10, borderBottomWidth: 0.5, borderBottomColor: BORDER },
  tableRowAlt: { flexDirection: "row", paddingVertical: 8, paddingHorizontal: 10, backgroundColor: LIGHT, borderBottomWidth: 0.5, borderBottomColor: BORDER },
  colDesc: { flex: 4 }, colPrice: { flex: 1, textAlign: "right" },
  thText: { fontFamily: "Helvetica-Bold", fontSize: 8.5, color: "#FFFFFF" },
  tdText: { fontSize: 9.5, color: BLACK }, tdMuted: { fontSize: 9.5, color: GRAY },
  totalsRight: { flexDirection: "row", justifyContent: "flex-end", marginTop: 12 },
  totalsBox: { width: 200 },
  totalFinalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 9, paddingHorizontal: 10, backgroundColor: PRIMARY, borderRadius: 4, marginTop: 4 },
  totalFinalLabel: { fontFamily: "Helvetica-Bold", fontSize: 10, color: "#FFFFFF" },
  totalFinalValue: { fontFamily: "Helvetica-Bold", fontSize: 10, color: ACCENT },
  notesSection: { marginTop: 24 },
  notesLabel: { fontFamily: "Helvetica-Bold", fontSize: 8, color: PRIMARY, letterSpacing: 1.5, marginBottom: 6, textTransform: "uppercase" },
  notesText: { fontSize: 9, color: GRAY, lineHeight: 1.7 },
  footer: { position: "absolute", bottom: 24, left: 48, right: 48, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  footerText: { fontSize: 7.5, color: GRAY },
  footerBrand: { fontSize: 7.5, color: PRIMARY, fontFamily: "Helvetica-Bold" },
});

export function TrainingPlanDocument({ data }) {
  const endDate = computeEndDate(data.startDate, data.durationWeeks);

  return (
    <Document title={`Training Program — ${data.clientName}`} author="Combo Breaker">
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View>
            <Text style={s.brandName}>COMBO BREAKER</Text>
            <Text style={s.brandTagline}>Fight Ready. Always.</Text>
            <Text style={s.brandContact}>{"info@combobreaker.com\n(888) 726-6263\ncombo-breaker.vercel.app"}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={s.docLabel}>TRAINING PROGRAM</Text>
            <Text style={s.docSubLabel}>{data.programName}</Text>
          </View>
        </View>

        <View style={s.divider} />

        <View style={s.twoCol}>
          <View style={s.col}>
            <Text style={s.colLabel}>Client</Text>
            <Text style={s.colName}>{data.clientName}</Text>
            <Text style={s.colText}>{data.clientEmail}</Text>
          </View>
          <View style={s.col}>
            <Text style={s.colLabel}>Program Details</Text>
            <Text style={s.colText}>{`Start:    ${formatDate(data.startDate)}`}</Text>
            <Text style={s.colText}>{`End:      ${formatDate(endDate)}`}</Text>
            <Text style={s.colText}>{`Schedule: ${data.sessionsPerWeek}x/week · ${data.sessionMinutes} min/session`}</Text>
            <Text style={s.colText}>{`Duration: ${data.durationWeeks} week${data.durationWeeks !== 1 ? 's' : ''}`}</Text>
          </View>
        </View>

        {data.disciplines.length > 0 && (
          <View style={s.focusSection}>
            <Text style={s.focusLabel}>Training Focus</Text>
            <View style={s.badgeRow}>
              {data.disciplines.map((d, i) => (
                <View key={i} style={s.badge}>
                  <Text style={s.badgeText}>{d.toUpperCase()}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={s.tableHeader}>
          <Text style={[s.thText, s.colDesc]}>What's Included</Text>
          <Text style={[s.thText, s.colPrice]}>Investment</Text>
        </View>

        {data.services.map((svc, idx) => (
          <View key={idx} style={idx % 2 === 0 ? s.tableRow : s.tableRowAlt}>
            <Text style={[s.tdText, s.colDesc]}>{svc.description}</Text>
            <Text style={[s.tdMuted, s.colPrice]}>{formatCurrency(svc.price)}</Text>
          </View>
        ))}

        <View style={s.totalsRight}>
          <View style={s.totalsBox}>
            <View style={s.totalFinalRow}>
              <Text style={s.totalFinalLabel}>Total Investment</Text>
              <Text style={s.totalFinalValue}>{formatCurrency(data.total)}</Text>
            </View>
          </View>
        </View>

        {data.notes ? (
          <View style={s.notesSection}>
            <Text style={s.notesLabel}>Program Notes</Text>
            <Text style={s.notesText}>{data.notes}</Text>
          </View>
        ) : null}

        <View style={s.footer}>
          <Text style={s.footerText}>Prepared for {data.clientName}</Text>
          <Text style={s.footerBrand}>COMBO BREAKER — Fight Ready. Always.</Text>
          <Text style={s.footerText}>{data.programName}</Text>
        </View>
      </Page>
    </Document>
  );
}
