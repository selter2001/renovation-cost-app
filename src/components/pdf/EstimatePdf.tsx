import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer'
import './pdf-fonts'
import type { Room } from '@/types/wizard'
import { PREDEFINED_WORKS } from '@/types/wizard'
import {
  getWorkQuantity,
  calcWorkCost,
  calcCustomWorkCost,
  calcRoomTotal,
  calcNetTotal,
  calcVat,
  calcGrossFromNet,
} from '@/lib/calc'
import { formatPLN } from '@/lib/format'

interface EstimatePdfProps {
  rooms: Room[]
  vatRate: 8 | 23
  language: 'pl' | 'en'
  translations: Record<string, string>
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    fontSize: 10,
    padding: 40,
    backgroundColor: '#ffffff',
    color: '#1a1a1a',
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 4,
  },
  date: {
    fontSize: 8,
    color: '#6b7280',
    marginBottom: 16,
  },
  roomHeading: {
    fontSize: 13,
    fontWeight: 500,
    marginTop: 14,
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  workRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  workName: {
    width: '40%',
  },
  workQty: {
    width: '20%',
    textAlign: 'right',
    color: '#6b7280',
  },
  workPrice: {
    width: '20%',
    textAlign: 'right',
    color: '#6b7280',
  },
  workCost: {
    width: '20%',
    textAlign: 'right',
    fontWeight: 500,
  },
  roomSubtotal: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  subtotalLabel: {
    fontWeight: 500,
    marginRight: 8,
  },
  subtotalValue: {
    fontWeight: 500,
  },
  totalsSection: {
    marginTop: 20,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: '#1a1a1a',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 2,
  },
  totalLabel: {
    marginRight: 16,
    color: '#6b7280',
  },
  totalValue: {
    width: 100,
    textAlign: 'right',
  },
  grossRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 4,
    marginTop: 4,
  },
  grossLabel: {
    marginRight: 16,
    fontWeight: 700,
    fontSize: 14,
  },
  grossValue: {
    width: 100,
    textAlign: 'right',
    fontWeight: 700,
    fontSize: 14,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 7,
    color: '#9ca3af',
  },
})

export function EstimatePdf({ rooms, vatRate, translations: tr }: EstimatePdfProps) {
  const net = calcNetTotal(rooms)
  const vat = calcVat(net, vatRate)
  const gross = calcGrossFromNet(net, vatRate)
  const today = new Date().toISOString().slice(0, 10)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{tr.title}</Text>
        <Text style={styles.date}>{today}</Text>

        {rooms.map((room) => {
          const roomTotal = calcRoomTotal(room)
          const activeWorks = PREDEFINED_WORKS.filter(
            (wt) => room.works[wt.id]?.enabled
          )

          return (
            <View key={room.id} wrap={false}>
              <Text style={styles.roomHeading}>{room.name}</Text>

              {activeWorks.map((wt) => {
                const qty = getWorkQuantity(room, wt.id)
                const price = room.works[wt.id].unitPrice
                const cost = calcWorkCost(qty, price)
                const unitLabel = tr[`unit_${wt.unit}`] ?? wt.unit
                return (
                  <View key={wt.id} style={styles.workRow}>
                    <Text style={styles.workName}>
                      {tr[`work_${wt.id}`] ?? wt.id}
                    </Text>
                    <Text style={styles.workQty}>
                      {qty.toFixed(2)} {unitLabel}
                    </Text>
                    <Text style={styles.workPrice}>
                      {formatPLN(price)}
                    </Text>
                    <Text style={styles.workCost}>{formatPLN(cost)}</Text>
                  </View>
                )
              })}

              {room.customWorks.map((cw) => {
                const cost = calcCustomWorkCost(cw)
                const unitLabel = tr[`unit_${cw.unit}`] ?? cw.unit
                return (
                  <View key={cw.id} style={styles.workRow}>
                    <Text style={styles.workName}>{cw.name}</Text>
                    <Text style={styles.workQty}>
                      {cw.quantity.toFixed(2)} {unitLabel}
                    </Text>
                    <Text style={styles.workPrice}>
                      {formatPLN(cw.unitPrice)}
                    </Text>
                    <Text style={styles.workCost}>{formatPLN(cost)}</Text>
                  </View>
                )
              })}

              <View style={styles.roomSubtotal}>
                <Text style={styles.subtotalLabel}>{tr.subtotal}:</Text>
                <Text style={styles.subtotalValue}>
                  {formatPLN(roomTotal)}
                </Text>
              </View>
            </View>
          )
        })}

        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{tr.netTotal}:</Text>
            <Text style={styles.totalValue}>{formatPLN(net)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              {tr.vat} {vatRate}%:
            </Text>
            <Text style={styles.totalValue}>{formatPLN(vat)}</Text>
          </View>
          <View style={styles.grossRow}>
            <Text style={styles.grossLabel}>{tr.grossTotal}:</Text>
            <Text style={styles.grossValue}>{formatPLN(gross)}</Text>
          </View>
        </View>

        <Text style={styles.footer}>Generated by RenoCost</Text>
      </Page>
    </Document>
  )
}
