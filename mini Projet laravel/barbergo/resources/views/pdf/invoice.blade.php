<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice #{{ $booking->id }} — BarberGo</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'DejaVu Sans', 'Helvetica', sans-serif;
            font-size: 13px;
            color: #1a1a1a;
            background: #fff;
            padding: 40px;
        }

        /* ── Header ── */
        .header {
            border-bottom: 3px solid #d97706;
            padding-bottom: 20px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        .brand-name {
            font-size: 32px;
            font-weight: bold;
            color: #1c1917;
            letter-spacing: -0.5px;
        }
        .brand-tagline {
            font-size: 11px;
            color: #78716c;
            margin-top: 4px;
            letter-spacing: 1.5px;
            text-transform: uppercase;
        }
        .invoice-label {
            text-align: right;
        }
        .invoice-label h2 {
            font-size: 20px;
            color: #d97706;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .invoice-label p {
            color: #78716c;
            font-size: 12px;
            margin-top: 4px;
        }

        /* ── Info Grid ── */
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }
        .info-box {
            background: #fafaf9;
            border: 1px solid #e7e5e4;
            border-radius: 8px;
            padding: 16px 18px;
        }
        .info-box-label {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #a8a29e;
            margin-bottom: 6px;
        }
        .info-box-value {
            font-size: 14px;
            font-weight: 600;
            color: #1c1917;
        }
        .info-box-sub {
            font-size: 12px;
            color: #78716c;
            margin-top: 2px;
        }

        /* ── Services Table ── */
        .section-title {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #a8a29e;
            margin-bottom: 10px;
        }
        table.services {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
        }
        table.services thead tr {
            background: #1c1917;
            color: #fff;
        }
        table.services thead th {
            padding: 10px 14px;
            text-align: left;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
        }
        table.services thead th:last-child {
            text-align: right;
        }
        table.services tbody tr {
            border-bottom: 1px solid #e7e5e4;
        }
        table.services tbody tr:nth-child(even) {
            background: #fafaf9;
        }
        table.services tbody td {
            padding: 11px 14px;
            font-size: 13px;
            color: #1c1917;
        }
        table.services tbody td:last-child {
            text-align: right;
            font-weight: 500;
        }

        /* ── Totals ── */
        .totals {
            margin-left: auto;
            width: 260px;
            margin-bottom: 40px;
        }
        .totals-row {
            display: flex;
            justify-content: space-between;
            padding: 7px 0;
            border-bottom: 1px solid #e7e5e4;
            font-size: 13px;
            color: #57534e;
        }
        .totals-row.grand-total {
            background: #1c1917;
            color: #fff;
            padding: 12px 14px;
            border-radius: 6px;
            margin-top: 6px;
            font-size: 15px;
            font-weight: bold;
            border: none;
        }
        .totals-row.grand-total span:first-child {
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        /* ── Footer ── */
        .footer {
            text-align: center;
            padding-top: 24px;
            border-top: 1px solid #e7e5e4;
            color: #a8a29e;
            font-size: 11px;
            letter-spacing: 0.5px;
        }
        .footer strong {
            color: #d97706;
        }
    </style>
</head>
<body>

    <!-- Header -->
    <div class="header">
        <div>
            <div class="brand-name">BarberGo</div>
            <div class="brand-tagline">Your Barber at Home</div>
        </div>
        <div class="invoice-label">
            <h2>Invoice</h2>
            <p>#{{ str_pad($booking->id, 5, '0', STR_PAD_LEFT) }}</p>
            <p>{{ now()->format('d M Y') }}</p>
        </div>
    </div>

    <!-- Info Grid -->
    <div class="info-grid">
        <div class="info-box">
            <div class="info-box-label">Client</div>
            <div class="info-box-value">{{ $booking->client->name }}</div>
            <div class="info-box-sub">{{ $booking->client->email }}</div>
            @if($booking->client->phone)
            <div class="info-box-sub">{{ $booking->client->phone }}</div>
            @endif
        </div>
        <div class="info-box">
            <div class="info-box-label">Hairdresser</div>
            <div class="info-box-value">{{ $booking->hairdresser->user->name }}</div>
            <div class="info-box-sub">{{ $booking->hairdresser->user->email }}</div>
        </div>
        <div class="info-box">
            <div class="info-box-label">Booking Date</div>
            <div class="info-box-value">{{ $booking->booking_date->format('d M Y') }}</div>
            <div class="info-box-sub">{{ $booking->booking_date->format('H:i') }}</div>
        </div>
        <div class="info-box">
            <div class="info-box-label">Service Address</div>
            <div class="info-box-value">{{ $booking->address }}</div>
        </div>
    </div>

    <!-- Services Table -->
    <div class="section-title">Services Rendered</div>
    <table class="services">
        <thead>
            <tr>
                <th>Service</th>
                <th>Duration</th>
                <th>Price (TND)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($booking->services as $service)
            <tr>
                <td>{{ $service->name }}</td>
                <td>{{ $service->duration_minutes }} min</td>
                <td>{{ number_format($service->price, 2) }} TND</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <!-- Totals -->
    <div class="totals">
        @php
            $subtotal = $booking->services->sum('price');
            $commission = round($subtotal * 0.135, 2);
        @endphp
        <div class="totals-row">
            <span>Subtotal</span>
            <span>{{ number_format($subtotal, 2) }} TND</span>
        </div>
        <div class="totals-row">
            <span>Platform fee (13.5%)</span>
            <span>{{ number_format($commission, 2) }} TND</span>
        </div>
        <div class="totals-row grand-total">
            <span>Total</span>
            <span>{{ number_format($booking->total, 2) }} TND</span>
        </div>
    </div>

    <!-- Footer -->
    <div class="footer">
        <p>Thank you for choosing <strong>BarberGo</strong>!</p>
        <p style="margin-top: 6px;">This invoice was automatically generated. Questions? Contact support@barbergo.tn</p>
    </div>

</body>
</html>
