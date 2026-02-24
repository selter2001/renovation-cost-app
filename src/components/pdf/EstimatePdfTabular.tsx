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

interface EstimatePdfTabularProps {
  rooms: Room[]
  vatRate: 8 | 23
  language: 'pl' | 'en'
  translations: Record<string, string>
}

const COL = {
  room: '18%' as const,
  work: '22%' as const,
  qty: '12%' as const,
  unit: '8%' as const,
  price: '18%' as const,
  cost: '22%' as const,
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    fontSize: 9,
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
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  headerCell: {
    fontWeight: 500,
    fontSize: 8,
    textTransform: 'uppercase',
    color: '#475569',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  rowAlt: {
    backgroundColor: '#f8fafc',
  },
  cell: {
    fontSize: 9,
  },
  cellRight: {
    fontSize: 9,
    textAlign: 'right',
  },
  subtotalRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#94a3b8',
    paddingVertical: 4,
    paddingHorizontal: 6,
    backgroundColor: '#f1f5f9',
  },
  subtotalLabel: {
    fontWeight: 500,
    fontSize: 9,
  },
  subtotalValue: {
    fontWeight: 700,
    fontSize: 9,
    textAlign: 'right',
  },
  totalsSection: {
    marginTop: 16,
    paddingTop: 10,
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
    fontSize: 10,
  },
  totalValue: {
    width: 100,
    textAlign: 'right',
    fontSize: 10,
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

interface WorkItem {
  roomName: string
  showRoom: boolean
  workName: string
  qty: string
  unit: string
  price: string
  cost: string
}

export function EstimatePdfTabular({
  rooms,
  vatRate,
  translations: tr,
}: EstimatePdfTabularProps) {
  const net = calcNetTotal(rooms)
  const vat = calcVat(net, vatRate)
  const gross = calcGrossFromNet(net, vatRate)
  const today = new Date().toISOString().slice(0, 10)

  // Build flat rows
  const allRows: { type: 'work'; data: WorkItem; index: number }[] | { type: 'subtotal'; roomName: string; total: number }[] = []
  let globalIndex = 0

  for (const room of rooms) {
    const activeWorks = PREDEFINED_WORKS.filter(
      (wt) => room.works[wt.id]?.enabled
    )
    let isFirst = true

    for (const wt of activeWorks) {
      const qty = getWorkQuantity(room, wt.id)
      const price = room.works[wt.id].unitPrice
      const cost = calcWorkCost(qty, price)
      const unitLabel = tr[`unit_${wt.unit}`] ?? wt.unit
      ;(allRows as { type: 'work'; data: WorkItem; index: number }[]).push({
        type: 'work',
        data: {
          roomName: room.name,
          showRoom: isFirst,
          workName: tr[`work_${wt.id}`] ?? wt.id,
          qty: qty.toFixed(2),
          unit: unitLabel,
          price: formatPLN(price),
          cost: formatPLN(cost),
        },
        index: globalIndex++,
      })
      isFirst = false
    }

    for (const cw of room.customWorks) {
      const cost = calcCustomWorkCost(cw)
      const unitLabel = tr[`unit_${cw.unit}`] ?? cw.unit
      ;(allRows as { type: 'work'; data: WorkItem; index: number }[]).push({
        type: 'work',
        data: {
          roomName: room.name,
          showRoom: isFirst,
          workName: cw.name,
          qty: cw.quantity.toFixed(2),
          unit: unitLabel,
          price: formatPLN(cw.unitPrice),
          cost: formatPLN(cost),
        },
        index: globalIndex++,
      })
      isFirst = false
    }

    const roomTotal = calcRoomTotal(room)
    ;(allRows as unknown as { type: 'subtotal'; roomName: string; total: number }[]).push({
      type: 'subtotal',
      roomName: room.name,
      total: roomTotal,
    })
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{tr.title}</Text>
        <Text style={styles.date}>{today}</Text>

        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={[styles.headerCell, { width: COL.room }]}>
            {tr.room}
          </Text>
          <Text style={[styles.headerCell, { width: COL.work }]}>
            {tr.work}
          </Text>
          <Text
            style={[
              styles.headerCell,
              { width: COL.qty, textAlign: 'right' },
            ]}
          >
            {tr.quantity}
          </Text>
          <Text
            style={[
              styles.headerCell,
              { width: COL.unit, textAlign: 'center' },
            ]}
          >
            {tr.unitLabel}
          </Text>
          <Text
            style={[
              styles.headerCell,
              { width: COL.price, textAlign: 'right' },
            ]}
          >
            {tr.unitPrice}
          </Text>
          <Text
            style={[
              styles.headerCell,
              { width: COL.cost, textAlign: 'right' },
            ]}
          >
            {tr.costLabel}
          </Text>
        </View>

        {/* Rows */}
        {(allRows as unknown[]).map((row, i) => {
          const r = row as { type: string; data?: WorkItem; index?: number; roomName?: string; total?: number }
          if (r.type === 'work' && r.data) {
            const isAlt = (r.index ?? 0) % 2 === 1
            return (
              <View
                key={`work-${i}`}
                style={[styles.row, isAlt ? styles.rowAlt : {}]}
              >
                <Text style={[styles.cell, { width: COL.room }]}>
                  {r.data.showRoom ? r.data.roomName : ''}
                </Text>
                <Text style={[styles.cell, { width: COL.work }]}>
                  {r.data.workName}
                </Text>
                <Text style={[styles.cellRight, { width: COL.qty }]}>
                  {r.data.qty}
                </Text>
                <Text
                  style={[
                    styles.cell,
                    { width: COL.unit, textAlign: 'center' },
                  ]}
                >
                  {r.data.unit}
                </Text>
                <Text style={[styles.cellRight, { width: COL.price }]}>
                  {r.data.price}
                </Text>
                <Text style={[styles.cellRight, { width: COL.cost }]}>
                  {r.data.cost}
                </Text>
              </View>
            )
          }

          if (r.type === 'subtotal') {
            return (
              <View key={`sub-${i}`} style={styles.subtotalRow}>
                <Text
                  style={[
                    styles.subtotalLabel,
                    {
                      width: `${
                        parseInt(COL.room) +
                        parseInt(COL.work) +
                        parseInt(COL.qty) +
                        parseInt(COL.unit) +
                        parseInt(COL.price)
                      }%`,
                    },
                  ]}
                >
                  {tr.subtotal}: {r.roomName}
                </Text>
                <Text style={[styles.subtotalValue, { width: COL.cost }]}>
                  {formatPLN(r.total ?? 0)}
                </Text>
              </View>
            )
          }

          return null
        })}

        {/* Totals */}
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
