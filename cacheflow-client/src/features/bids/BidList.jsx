import { formatCurrency, formatDate } from '../auctions/auctionUtils'
import './bids.css'

export default function BidList({ bids, currentUserId, onUndoBid }) {
  if (bids.length === 0) {
    return (
      <div className="bid-list">
        <h2 className="bid-list__title">Budhistorik</h2>
        <p className="bid-list__empty">Inga bud har lagts ännu. Var först!</p>
      </div>
    )
  }

  const latestBid = bids[0]

  return (
    <div className="bid-list">
      <h2 className="bid-list__title">Budhistorik ({bids.length})</h2>
      <div className="bid-list__table-wrapper">
        <table className="bid-list__table">
          <thead>
            <tr>
              <th>Budgivare</th>
              <th>Belopp</th>
              <th>Datum</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {bids.map((bid, index) => {
              const isOwnBid    = bid.userId === currentUserId
              const isLatestBid = bid.id === latestBid.id

              return (
                <tr key={bid.id} className={`bid-list__row ${index === 0 ? 'bid-list__row--top' : ''}`}>
                  <td className="bid-list__bidder">
                    {bid.bidderUsername}
                    {isOwnBid && <span className="bid-list__you-badge"> (du)</span>}
                  </td>
                  <td className="bid-list__amount">{formatCurrency(bid.amount)}</td>
                  <td className="bid-list__date">{formatDate(bid.createdAt)}</td>
                  <td>
                    {isOwnBid && isLatestBid && onUndoBid && (
                      <button
                        className="btn btn-danger bid-list__undo-btn"
                        onClick={() => onUndoBid(bid.id)}
                      >
                        Ångra
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
