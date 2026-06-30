import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { formatCurrency, formatDate } from "./types.js";

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
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 36 },
  brandName: { fontFamily: "Helvetica-Bold", fontSize: 22, color: PRIMARY, letterSpacing: 1 },
  brandTagline: { fontSize: 9, color: GRAY, marginTop: 2, letterSpacing: 0.5 },
  brandContact: { fontSize: 8, color: GRAY, marginTop: 6, lineHeight: 1.5 },
  invoiceMeta: { alignItems: "flex-end" },
  invoiceLabel: { fontFamily: "Helvetica-Bold", fontSize: 26, color: ACCENT, letterSpacing: 2, marginBottom: 8 },
  metaRow: { flexDirection: "row", gap: 6, marginTop: 3 },
  metaKey: { fontFamily: "Helvetica-Bold", fontSize: 9, color: GRAY, width: 72, textAlign: "right" },
  metaVal: { fontSize: 9, color: BLACK, width: 80, textAlign: "right" },
  divider: { height: 2, backgroundColor: PRIMARY, marginBottom: 24 },
  billSection: { flexDirection: "row", marginBottom: 28 },
  billBox: { flex: 1, backgroundColor: LIGHT, borderRadius: 4, padding: 14, marginRight: 12 },
  billLabel: { fontFamily: "Helvetica-Bold", fontSize: 8, color: PRIMARY, letterSpacing: 1.5, marginBottom: 8, textTransform: "uppercase" },
  billName: { fontFamily: "Helvetica-Bold", fontSize: 11, color: PRIMARY, marginBottom: 3 },
  billText: { fontSize: 9, color: GRAY, lineHeight: 1.6 },
  tableHeader: { flexDirection: "row", backgroundColor: PRIMARY, borderRadius: 3, paddingVertical: 7, paddingHorizontal: 10 },
  tableRow: { flexDirection: "row", paddingVertical: 8, paddingHorizontal: 10, borderBottomWidth: 0.5, borderBottomColor: BORDER, borderBottomStyle: "solid" },
  tableRowAlt: { flexDirection: "row", paddingVertical: 8, paddingHorizontal: 10, backgroundColor: LIGHT, borderBottomWidth: 0.5, borderBottomColor: BORDER, borderBottomStyle: "solid" },
  colDesc: { flex: 5 }, colQty: { flex: 1, textAlign: "center" }, colRate: { flex: 2, textAlign: "right" }, colTotal: { flex: 2, textAlign: "right" },
  thText: { fontFamily: "Helvetica-Bold", fontSize: 8.5, color: "#FFFFFF", letterSpacing: 0.5 },
  tdText: { fontSize: 9.5, color: BLACK }, tdMuted: { fontSize: 9.5, color: GRAY },
  totalsSection: { flexDirection: "row", justifyContent: "flex-end", marginTop: 16 },
  totalsBox: { width: 220 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4, paddingHorizontal: 10 },
  totalRowFinal: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 9, paddingHorizontal: 10, backgroundColor: PRIMARY, borderRadius: 4, marginTop: 4 },
  totalLabel: { fontSize: 9, color: GRAY }, totalValue: { fontSize: 9, color: BLACK },
  totalLabelFinal: { fontFamily: "Helvetica-Bold", fontSize: 10, color: "#FFFFFF" },
  totalValueFinal: { fontFamily: "Helvetica-Bold", fontSize: 10, color: ACCENT },
  notesSection: { marginTop: 28 },
  notesLabel: { fontFamily: "Helvetica-Bold", fontSize: 8, color: PRIMARY, letterSpacing: 1.5, marginBottom: 6, textTransform: "uppercase" },
  notesText: { fontSize: 9, color: GRAY, lineHeight: 1.7 },
  footer: { position: "absolute", bottom: 24, left: 48, right: 48, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  footerText: { fontSize: 7.5, color: GRAY },
  footerBrand: { fontSize: 7.5, color: PRIMARY, fontFamily: "Helvetica-Bold" },
});

export function InvoiceDocument({ data }) {
  return (
    <Document title={`Invoice ${data.invoiceNumber}`} author="Combo Breaker">
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View>
            <Text style={s.brandName}>COMBO BREAKER</Text>
            <Text style={s.brandTagline}>Fight Ready. Always.</Text>
            <Text style={s.brandContact}>{"info@combobreaker.com\n(888) 726-6263\ncombo-breaker.vercel.app"}</Text>
          </View>
          <View style={s.invoiceMeta}>
            <Text style={s.invoiceLabel}>INVOICE</Text>
            <View style={s.metaRow}><Text style={s.metaKey}>Invoice #</Text><Text style={s.metaVal}>{data.invoiceNumber}</Text></View>
            <View style={s.metaRow}><Text style={s.metaKey}>Date</Text><Text style={s.metaVal}>{formatDate(data.invoiceDate)}</Text></View>
            <View style={s.metaRow}><Text style={s.metaKey}>Due Date</Text><Text style={s.metaVal}>{formatDate(data.dueDate)}</Text></View>
          </View>
        </View>

        <View style={s.divider} />

        <View style={s.billSection}>
          <View style={s.billBox}>
            <Text style={s.billLabel}>Bill To</Text>
            <Text style={s.billName}>{data.clientName}</Text>
            <Text style={s.billText}>{data.clientEmail}</Text>
            {data.clientAddress ? <Text style={s.billText}>{data.clientAddress}</Text> : null}
          </View>
        </View>

        <View style={s.tableHeader}>
          <Text style={[s.thText, s.colDesc]}>Description</Text>
          <Text style={[s.thText, s.colQty]}>Qty</Text>
          <Text style={[s.thText, s.colRate]}>Unit Price</Text>
          <Text style={[s.thText, s.colTotal]}>Total</Text>
        </View>

        {data.items.map((item, idx) => (
          <View key={idx} style={idx % 2 === 0 ? s.tableRow : s.tableRowAlt}>
            <Text style={[s.tdText, s.colDesc]}>{item.description}</Text>
            <Text style={[s.tdMuted, s.colQty]}>{item.quantity}</Text>
            <Text style={[s.tdMuted, s.colRate]}>{formatCurrency(item.unitPrice)}</Text>
            <Text style={[s.tdText, s.colTotal]}>{formatCurrency(item.quantity * item.unitPrice)}</Text>
          </View>
        ))}

        <View style={s.totalsSection}>
          <View style={s.totalsBox}>
            <View style={s.totalRow}><Text style={s.totalLabel}>Subtotal</Text><Text style={s.totalValue}>{formatCurrency(data.subtotal)}</Text></View>
            {data.taxRate > 0 && <View style={s.totalRow}><Text style={s.totalLabel}>Tax ({data.taxRate}%)</Text><Text style={s.totalValue}>{formatCurrency(data.taxAmount)}</Text></View>}
            <View style={s.totalRowFinal}><Text style={s.totalLabelFinal}>Total Due</Text><Text style={s.totalValueFinal}>{formatCurrency(data.total)}</Text></View>
          </View>
        </View>

        {data.notes ? (
          <View style={s.notesSection}>
            <Text style={s.notesLabel}>Notes & Terms</Text>
            <Text style={s.notesText}>{data.notes}</Text>
          </View>
        ) : null}

        <View style={s.footer}>
          <Text style={s.footerText}>Thank you for your business.</Text>
          <Text style={s.footerBrand}>COMBO BREAKER — Fight Ready. Always.</Text>
          <Text style={s.footerText}>Invoice {data.invoiceNumber}</Text>
        </View>
      </Page>
    </Document>
  );
}
