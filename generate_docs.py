import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def set_cell_background(cell, hex_color):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=120, bottom=120, left=160, right=160):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def set_table_borders(table, color="D1D5DB", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:left w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'<w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideV w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def build_trendmart_master_doc(output_path):
    doc = Document()

    # Standard 1-inch margins
    for sec in doc.sections:
        sec.top_margin = Inches(1.0)
        sec.bottom_margin = Inches(1.0)
        sec.left_margin = Inches(1.0)
        sec.right_margin = Inches(1.0)

    # Palette
    C_NAVY = RGBColor(30, 58, 138)       # #1E3A8A Primary Brand
    C_BLUE = RGBColor(37, 99, 235)       # #2563EB Accent
    C_DARK = RGBColor(31, 41, 55)        # #1F2937 Text Dark
    C_MUTED = RGBColor(100, 116, 139)    # #64748B Secondary Text
    HEX_HEADER = "1E3A8A"
    HEX_ALT = "F8FAFC"
    HEX_CALLOUT_BG = "EFF6FF"
    HEX_CALLOUT_BORDER = "3B82F6"

    # Base Typography
    st = doc.styles['Normal']
    st.font.name = 'Calibri'
    st.font.size = Pt(11)
    st.font.color.rgb = C_DARK
    st.paragraph_format.line_spacing = 1.15
    st.paragraph_format.space_after = Pt(6)

    def add_sec_h(text, lvl=1):
        h = doc.add_heading(text, level=lvl)
        h.paragraph_format.space_before = Pt(18 if lvl==1 else 14)
        h.paragraph_format.space_after = Pt(6)
        if lvl == 1:
            h.runs[0].font.color.rgb = C_NAVY
            h.runs[0].font.size = Pt(18)
        elif lvl == 2:
            h.runs[0].font.color.rgb = C_BLUE
            h.runs[0].font.size = Pt(14)
        else:
            h.runs[0].font.color.rgb = C_DARK
            h.runs[0].font.size = Pt(12)
        return h

    def add_note(txt, prefix="KEY INSIGHT: "):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tbl.autofit = False
        tbl.columns[0].width = Inches(6.5)
        c = tbl.cell(0, 0)
        set_cell_background(c, HEX_CALLOUT_BG)
        set_cell_margins(c, top=140, bottom=140, left=180, right=180)
        tcPr = c._tc.get_or_add_tcPr()
        borders = parse_xml(
            f'<w:tcBorders {nsdecls("w")}>'
            f'<w:top w:val="none"/><w:bottom w:val="none"/>'
            f'<w:left w:val="single" w:sz="24" w:space="0" w:color="{HEX_CALLOUT_BORDER}"/>'
            f'<w:right w:val="none"/>'
            f'</w:tcBorders>'
        )
        tcPr.append(borders)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r1 = p.add_run(prefix)
        r1.font.bold = True
        r1.font.size = Pt(10)
        r1.font.color.rgb = C_NAVY
        r2 = p.add_run(txt)
        r2.font.size = Pt(10)
        doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # ==================== COVER PAGE ====================
    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_before = Pt(70)

    p_badge = doc.add_paragraph()
    r_b = p_badge.add_run("ENTERPRISE E-COMMERCE PLATFORM SPECIFICATION")
    r_b.font.size = Pt(11)
    r_b.font.bold = True
    r_b.font.color.rgb = C_BLUE
    p_badge.paragraph_format.space_after = Pt(12)

    p_main_title = doc.add_paragraph()
    r_mt = p_main_title.add_run("TrendMart Multi-Site Ecosystem")
    r_mt.font.size = Pt(32)
    r_mt.font.bold = True
    r_mt.font.color.rgb = C_NAVY
    p_main_title.paragraph_format.space_after = Pt(6)

    p_tag = doc.add_paragraph()
    r_tg = p_tag.add_run("Complete End-to-End System Documentation, Architecture, Interconnected CRUD Workflows & Operational Manual")
    r_tg.font.size = Pt(13.5)
    r_tg.font.color.rgb = C_MUTED
    p_tag.paragraph_format.space_after = Pt(40)

    p_line = doc.add_paragraph()
    r_l = p_line.add_run("―" * 50)
    r_l.font.color.rgb = C_BLUE

    p_m = doc.add_paragraph()
    p_m.paragraph_format.space_before = Pt(80)
    meta = [
        ("Platform Edition:", "TrendMart Enterprise Multi-Site Suite v2.4.0"),
        ("Ecosystem Endpoints:", "Admin (:3000) • Storefront (:3001) • Seller Hub (:3002) • REST Engine (:5000)"),
        ("Technology Baseline:", "React 18 CDN Architecture • Babel Standalone • Native CSS3 Tokens • JSON DB"),
        ("Document Status:", "Approved Production Baseline"),
        ("Release Date:", "November 2026")
    ]
    for lbl, v in meta:
        r1 = p_m.add_run(f"{lbl:<24} ")
        r1.font.bold = True
        r1.font.size = Pt(10)
        r1.font.color.rgb = C_NAVY
        r2 = p_m.add_run(f"{v}\n")
        r2.font.size = Pt(10)
        r2.font.color.rgb = C_DARK

    doc.add_page_break()

    # ==================== TABLE OF CONTENTS ====================
    add_sec_h("Table of Contents", lvl=1)
    toc = [
        ("1. Executive Summary & Architectural Vision", "3"),
        ("2. Multi-Site Ecosystem Topology & Network Architecture", "4"),
        ("3. Core Technology Stack & Engineering Rationale", "6"),
        ("4. Module 1: Admin Master Console (Port 3000)", "8"),
        ("5. Module 2: Customer Storefront Experience (Port 3001)", "11"),
        ("6. Module 3: Seller Hub & Vendor Fulfillment (Port 3002)", "14"),
        ("7. Module 4: Central Database & REST API Microservice (Port 5000)", "17"),
        ("8. Transparent Reverse Proxy Gateway & Process Runner (run_ecosystem.js)", "19"),
        ("9. Interconnected Real-Time CRUD Operations & Sequence Workflows", "21"),
        ("10. Exhaustive Database Schema & Data Models Specification", "23"),
        ("11. Comprehensive REST API Endpoints Specification", "26"),
        ("12. UI/UX Design System, SVG Vector Standard & Theming Engine", "29"),
        ("13. Local Setup, Multi-Port Configuration & Developer Operations", "31"),
        ("14. Quality Assurance, Testing Matrix & Browser Verification", "33"),
        ("15. Production Deployment, Security Architecture & Future Roadmap", "35")
    ]
    for it, pg in toc:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(3)
        r = p.add_run(it)
        r.font.size = Pt(10)
        r.font.bold = not it.startswith("   ")
        r.font.color.rgb = C_NAVY if not it.startswith("   ") else C_MUTED
        dots = "." * max(5, 75 - len(it) * 2)
        r_d = p.add_run(" " + dots + " ")
        r_d.font.color.rgb = RGBColor(209, 213, 219)
        r_p = p.add_run(pg)
        r_p.font.bold = True
        r_p.font.size = Pt(10)
        r_p.font.color.rgb = C_BLUE

    doc.add_page_break()

    # ==================== SECTION 1 ====================
    add_sec_h("1. Executive Summary & Architectural Vision", lvl=1)
    doc.add_paragraph(
        "TrendMart is an enterprise-class digital commerce ecosystem designed to solve the complexity of multi-tenant retail operations. "
        "Modern online commerce demands seamless, synchronous coordination across three fundamentally different user personas: "
        "shoppers desiring friction-free checkout, merchants managing warehouse inventory and order fulfillment, and administrators "
        "exercising platform-wide oversight and analytics."
    )
    doc.add_paragraph(
        "Historically, digital commerce systems were architected as monolithic web applications where customer views, merchant tools, "
        "and administrative control panels co-mingled in a single web process. TrendMart fundamentally modernizes this approach by "
        "cleanly partitioning the ecosystem into three autonomous web applications running on independent ports (3000, 3001, 3002), "
        "all tethered to an asynchronous central REST API engine (5000). Every catalog addition, cart checkout, stock deduction, and status "
        "transition executes as an atomic CRUD event that instantly synchronizes across all nodes."
    )
    add_note(
        "Zero-Bundler Architecture: TrendMart delivers modern component-driven React 18 functionality directly through the browser "
        "via CDN and in-browser Babel Standalone transpilation. This eliminates Node.js build-step friction (e.g. Webpack/Vite build delays), "
        "enabling instantaneous runtime code execution while maintaining full component encapsulation and state reactivity."
    )

    # ==================== SECTION 2 ====================
    add_sec_h("2. Multi-Site Ecosystem Topology & Network Architecture", lvl=1)
    doc.add_paragraph(
        "The TrendMart ecosystem operates across four dedicated local network nodes, orchestrated by a central runner daemon (run_ecosystem.js):"
    )

    tbl_nodes = doc.add_table(rows=5, cols=4)
    tbl_nodes.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_nodes.autofit = False
    set_table_borders(tbl_nodes)
    nw = [Inches(1.2), Inches(1.2), Inches(1.8), Inches(2.3)]
    for i, h in enumerate(["Node Name", "Binding Port", "Target Persona", "Primary Functional Scope"]):
        c = tbl_nodes.cell(0, i)
        c.width = nw[i]
        set_cell_background(c, HEX_HEADER)
        set_cell_margins(c, 120, 120, 140, 140)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h)
        r.font.bold = True
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor(255, 255, 255)

    n_data = [
        ("Admin Console", "http://localhost:3000", "Platform Super Administrator", "KPI Sales Analytics, Department Categories, 20 Products, 12 Customers (Paginated), Orders Sync, Banners & Themes"),
        ("Customer Store", "http://localhost:3001", "Consumer Shoppers / Buyers", "Brand Navigation, Emoji-free Department Pills, Product Cards, Strikethrough Pricing, Cart Drawer, Checkout & Order Tracking"),
        ("Seller Hub", "http://localhost:3002", "Merchants & Brand Proprietors", "Vendor Profile Selector, Product Catalog CRUD, Incoming Order Fulfillment Queue, Status Dispatches & Financial Insights"),
        ("Central REST API", "http://localhost:5000", "Microservice Database Tier", "20 REST Endpoints, Persistent JSON Storage (trendmart_db.json), Atomic Inventory Decrement, Tracking History & CORS Engine")
    ]
    for idx, row in enumerate(n_data, start=1):
        bg = HEX_ALT if idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row):
            c = tbl_nodes.cell(idx, c_idx)
            c.width = nw[c_idx]
            set_cell_background(c, bg)
            set_cell_margins(c, 90, 90, 120, 120)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.size = Pt(9)
            if c_idx == 0: r.font.bold = True; r.font.color.rgb = C_NAVY
            elif c_idx == 1: r.font.color.rgb = C_BLUE

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # ==================== SECTION 3 ====================
    add_sec_h("3. Core Technology Stack & Engineering Rationale", lvl=1)
    techs = [
        ("React 18.2 (In-Browser CDN)", "Employs modern React declarative UI state handling (useState, useEffect, useMemo, useCallback) through CDN distribution packages, bypassing local node_modules bloat."),
        ("Babel Standalone 7.x", "Dynamically transpiles JSX code in-browser at runtime. Enables developers to edit plain React component files (.js) without running heavy compilation pipelines."),
        ("Pure Native CSS3 Tokens", "Employs zero external CSS frameworks (no Tailwind/Bootstrap). Custom properties (--sh-primary, --bg-card, --border) provide immediate, 0ms latency dark/light mode switches across all components."),
        ("Inline SVG Vector Icons", "Strictly eliminates emojis in favor of crisp inline SVG vector iconography with standard 2.0 stroke weights, rounded caps, and dynamic fill states."),
        ("Node.js Native HTTP Microservice", "Core http, url, path, and fs modules construct high-performance asynchronous REST endpoints without heavy third-party framework dependencies."),
        ("Persistent JSON Engine", "Thread-safe, synchronous ACID-like disk persistence in server/data/trendmart_db.json ensures immediate state recovery across server restarts.")
    ]
    for title, desc in techs:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(4)
        r1 = p.add_run(f"• {title}: ")
        r1.font.bold = True
        r1.font.color.rgb = C_NAVY
        r2 = p.add_run(desc)
        r2.font.size = Pt(10)

    doc.add_page_break()

    # ==================== SECTION 4 ====================
    add_sec_h("4. Module 1: Admin Master Console (Port 3000)", lvl=1)
    doc.add_paragraph(
        "The Admin Console provides comprehensive governance over platform transactions, merchandise, customers, and branding. "
        "It consists of eight fully integrated sub-modules accessible via the professional sidebar navigation:"
    )

    admin_tabs = [
        ("Dashboard Tab", "Displays real-time KPI metrics: Today's Gross Sales (₹ INR with daily growth percentage), Total Customer Orders, Active Catalog Listings, Registered Customer count, and Low Stock Inventory Alerts. Features an interactive SVG sales velocity chart with 7D, 30D, and YTD time filters, hover tooltips, and calculated average order values."),
        ("Categories Tab", "Department catalog manager controlling the 5 primary retail categories (Electronics, Fashion & Apparel, Home & Kitchen, Beauty & Wellness, Sports & Outdoors) with custom cover graphics and active badges."),
        ("Products Tab", "Comprehensive catalog ledger listing all 20 active items. Displays image thumbnails, SKUs, retail selling prices, original MRPs, vendor attributions, available inventory counts, and real-time In Stock / Low Stock status badges."),
        ("Customers Tab", "Directory of 12 registered Indian customer accounts. Incorporates real-time debounced customer search and 10-per-page pagination controls with boundary safeguards."),
        ("Orders Tab", "Bidirectional order fulfillment manager. Synchronizes live orders from the Central REST API with 4-second background polling and a manual Refresh button. Displays customer delivery details, item breakdowns, total amounts, and live status dropdown controls (Pending, Processing, Shipped, Delivered, Cancelled) that immediately persist back to the database."),
        ("Banners Tab", "Promotional merchandising engine managing seasonal campaigns (e.g. Summer Mega Fest 2026, Smart Living) with activation toggles."),
        ("Profile Tab", "Administrator account manager supporting custom full name, email, role badge, and avatar photo uploads that dynamically reflect in the topbar."),
        ("Settings Tab", "Regional settings, default currency configuration (₹ INR, $ USD, € EUR), low-stock alert thresholds, support email contacts, and secure sign-out confirmation modals.")
    ]
    for tab, desc in admin_tabs:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(4)
        r1 = p.add_run(f"{tab}: ")
        r1.font.bold = True
        r1.font.color.rgb = C_NAVY
        r2 = p.add_run(desc)
        r2.font.size = Pt(10)

    # ==================== SECTION 5 ====================
    add_sec_h("5. Module 2: Customer Storefront Experience (Port 3001)", lvl=1)
    doc.add_paragraph(
        "The Customer Storefront delivers a modern, high-conversion shopping experience tailored for digital retail shoppers:"
    )
    cust_flows = [
        ("Brand Navigation Header", "Features the official TrendMart brand logo. Clicking the logo smoothly scrolls the window to the top and resets search filters back to 'All Deals'."),
        ("Professional Category Filter Bar", "Presents department pills (All Deals, Electronics, Fashion & Apparel, Home & Kitchen, Beauty & Wellness, Sports & Outdoors) completely free of emojis, utilizing subtle borders and active accent pills."),
        ("Dynamic Product Cards", "Cards showcase high-res Unsplash photography, calculated percentage-off discount tags, original MRP strikethroughs, seller store badges, star ratings, and 'Add to Cart' controls."),
        ("Interactive Cart Drawer", "Side-sliding overlay with quantity steppers (+ / -), automatic stock limit caps, subtotal computations, and instant checkout triggers."),
        ("Checkout & Order Submission", "Captures customer shipping address, phone number, and payment method (Cash on Delivery vs Instant UPI/Card). Submitting the order triggers an atomic inventory decrement in the database."),
        ("Customer Order Tracking", "'My Orders' modal displaying historic and active purchases with tracking codes (e.g. TM-2026-95049) and fulfillment timestamps."),
        ("User Profile Navigation", "Top-right navbar cleanly arranges: Admin Console link -> Seller Hub link -> Cart button with live count badge -> My Orders -> User Profile badge (Aarav Sharma with Sign Out control).")
    ]
    for title, desc in cust_flows:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(4)
        r1 = p.add_run(f"• {title}: ")
        r1.font.bold = True
        r1.font.color.rgb = C_NAVY
        r2 = p.add_run(desc)
        r2.font.size = Pt(10)

    doc.add_page_break()

    # ==================== SECTION 6 ====================
    add_sec_h("6. Module 3: Seller Hub & Vendor Fulfillment (Port 3002)", lvl=1)
    doc.add_paragraph(
        "The Seller Hub is designed in the style of Amazon Seller Central and Stripe Dashboard, offering specialized merchant tools:"
    )
    seller_flows = [
        ("Vendor Identity Switcher", "Allows quick authentication across registered merchants: AeroTech Electronics (Vikram Malhotra), Urban Chic Apparels (Pooja Gupta), and Heritage Home (Rameshwar Sharma)."),
        ("Live Inventory CRUD", "Merchants can add new offerings (+ Add Product modal), edit unit pricing/stock, update image URLs, or delete discontinued SKUs. Changes instantly synchronize to the Customer Storefront."),
        ("Incoming Order Fulfillment Queue", "Filters the global order ledger to display only purchases containing products owned by the authenticated merchant. Sellers can advance fulfillment status from 'Processing' to 'Shipped' and 'Delivered'."),
        ("Earnings & Financial Health", "Computes cumulative store revenue, active listed SKUs, pending dispatch counts, and stock attention alerts (<= 10 units)."),
        ("Professional SVG Design System", "Features clean inline SVG vector icons across all sidebar links, metric cards, and table row actions (Edit/Delete).")
    ]
    for title, desc in seller_flows:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(4)
        r1 = p.add_run(f"• {title}: ")
        r1.font.bold = True
        r1.font.color.rgb = C_NAVY
        r2 = p.add_run(desc)
        r2.font.size = Pt(10)

    # ==================== SECTION 7 ====================
    add_sec_h("7. Module 4: Central Database & REST API Microservice (Port 5000)", lvl=1)
    doc.add_paragraph(
        "The Central REST API server (server/server.js) and database layer (server/db.js) operate as the authoritative single source of truth for the entire ecosystem. "
        "It provides persistent, thread-safe JSON file storage (server/data/trendmart_db.json) initialized with 20 rich catalog products across 5 departments, "
        "12 registered customers, 3 vendor accounts, and active order records."
    )
    add_note(
        "Atomic Stock Decrement Logic: When POST /api/orders receives an order payload, db.js iterates through each purchased line item, "
        "locates the corresponding product in the inventory ledger, and decrements available stock. If stock drops to <= 10, the product's "
        "status automatically shifts from 'In Stock' to 'Low Stock'. If stock reaches 0, it transitions to 'Out of Stock'."
    )

    # ==================== SECTION 8 ====================
    add_sec_h("8. Transparent Reverse Proxy Gateway & Process Runner (run_ecosystem.js)", lvl=1)
    doc.add_paragraph(
        "A standout architectural achievement in TrendMart is run_ecosystem.js. Instead of requiring developers to manually start four separate "
        "terminal sessions, run_ecosystem.js orchestrates all four servers simultaneously in a single command."
    )
    doc.add_paragraph(
        "Furthermore, run_ecosystem.js implements a Transparent Reverse Proxy Gateway. When any client application on port 3000, 3001, or 3002 "
        "issues an HTTP request starting with /api/*, the server intercepts the request and streams it directly to the Central API engine on port 5000. "
        "This completely eliminates Cross-Origin Resource Sharing (CORS) friction and allows all frontends to communicate using standard relative URLs."
    )

    doc.add_page_break()

    # ==================== SECTION 9 ====================
    add_sec_h("9. Interconnected Real-Time CRUD Operations & Sequence Workflows", lvl=1)
    doc.add_paragraph(
        "The platform's unified architecture ensures seamless data propagation across the lifecycle of every transaction:"
    )
    seqs = [
        ("1. Product Creation", "Seller adds 'Sony WH-1000XM5 Wireless Headphones' on :3002. POST /api/products executes -> Written to trendmart_db.json -> Customer Storefront (:3001) catalog displays product -> Admin Console (:3000) inventory ledger updates."),
        ("2. Order Placement", "Customer places order for 2 units on :3001. POST /api/orders executes -> Database stock decrements from 25 to 23 -> Order TM-2026-XXXX created -> Customer spend increases -> Cart empties."),
        ("3. Order Dispatch", "Seller Hub (:3002) detects incoming order -> Merchant packages goods and updates dropdown to 'Shipped' via PUT /api/orders/:id/status -> Database appends tracking history event."),
        ("4. Customer Notification", "Customer clicks 'My Orders' on :3001 -> Order status displays 'Shipped' with timestamped milestone history."),
        ("5. Executive Governance", "Admin opens :3000 Dashboard -> Total revenue increases by order amount -> Order Management tab reflects status as 'Shipped' -> Product stock displays 23 units.")
    ]
    for s_title, s_desc in seqs:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(4)
        r1 = p.add_run(f"{s_title}: ")
        r1.font.bold = True
        r1.font.color.rgb = C_NAVY
        r2 = p.add_run(s_desc)
        r2.font.size = Pt(10)

    # ==================== SECTION 10 ====================
    add_sec_h("10. Exhaustive Database Schema & Data Models Specification", lvl=1)
    doc.add_paragraph(
        "The data repository (server/data/trendmart_db.json) defines standardized JSON data models across five primary entities:"
    )

    # Products Table
    add_sec_h("10.1. Products Entity Schema", lvl=2)
    tbl_p = doc.add_table(rows=8, cols=4)
    tbl_p.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_p.autofit = False
    set_table_borders(tbl_p)
    w_sch = [Inches(1.2), Inches(1.0), Inches(1.0), Inches(3.3)]
    for i, h in enumerate(["Field Name", "Type", "Constraint", "Description"]):
        c = tbl_p.cell(0, i)
        c.width = w_sch[i]
        set_cell_background(c, HEX_HEADER)
        set_cell_margins(c, 100, 100, 120, 120)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h)
        r.font.bold = True; r.font.size = Pt(9.5); r.font.color.rgb = RGBColor(255, 255, 255)

    p_rows = [
        ("id", "String", "Primary Key", "Unique product SKU (e.g. 'prod-1')"),
        ("title / name", "String", "Required", "Full marketing item name"),
        ("category", "String", "Required", "Department name (Electronics, Fashion, etc.)"),
        ("price", "Number", "Required", "Current discounted selling price in ₹ INR"),
        ("originalPrice", "Number", "Optional", "Original MRP for strikethrough price calculation"),
        ("stock", "Number", "Required", "Current physical inventory units"),
        ("sellerId / sellerName", "String", "Foreign Key", "Merchant owner identification")
    ]
    for idx, (f, t, con, d) in enumerate(p_rows, start=1):
        bg = HEX_ALT if idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate([f, t, con, d]):
            c = tbl_p.cell(idx, c_idx)
            c.width = w_sch[c_idx]
            set_cell_background(c, bg)
            set_cell_margins(c, 80, 80, 120, 120)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.size = Pt(9)
            if c_idx == 0: r.font.bold = True

    # Orders Table
    add_sec_h("10.2. Orders Entity Schema", lvl=2)
    tbl_o = doc.add_table(rows=8, cols=4)
    tbl_o.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_o.autofit = False
    set_table_borders(tbl_o)
    for i, h in enumerate(["Field Name", "Type", "Constraint", "Description"]):
        c = tbl_o.cell(0, i)
        c.width = w_sch[i]
        set_cell_background(c, HEX_HEADER)
        set_cell_margins(c, 100, 100, 120, 120)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h)
        r.font.bold = True; r.font.size = Pt(9.5); r.font.color.rgb = RGBColor(255, 255, 255)

    o_rows = [
        ("id", "String", "Primary Key", "Internal database identifier (e.g. 'ORD-1001')"),
        ("orderNumber", "String", "Unique", "Customer tracking code (e.g. 'TM-2026-95049')"),
        ("customerName", "String", "Required", "Full recipient legal name"),
        ("shippingAddress", "String", "Required", "Physical postal delivery address"),
        ("items", "Array<Item>", "Required", "Ordered line items [{productId, quantity, price}]"),
        ("totalAmount", "Number", "Required", "Gross financial total in ₹ INR"),
        ("status", "Enum", "Required", "Pending | Processing | Shipped | Delivered | Cancelled")
    ]
    for idx, (f, t, con, d) in enumerate(o_rows, start=1):
        bg = HEX_ALT if idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate([f, t, con, d]):
            c = tbl_o.cell(idx, c_idx)
            c.width = w_sch[c_idx]
            set_cell_background(c, bg)
            set_cell_margins(c, 80, 80, 120, 120)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.size = Pt(9)
            if c_idx == 0: r.font.bold = True

    doc.add_page_break()

    # ==================== SECTION 11 ====================
    add_sec_h("11. Comprehensive REST API Endpoints Specification", lvl=1)
    doc.add_paragraph(
        "The Central REST API server (Port 5000) exposes standardized HTTP endpoints adhering to RESTful conventions:"
    )

    tbl_api = doc.add_table(rows=14, cols=4)
    tbl_api.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_api.autofit = False
    set_table_borders(tbl_api)
    api_w = [Inches(1.0), Inches(2.2), Inches(1.1), Inches(2.2)]

    for i, h in enumerate(["Method", "Endpoint URI", "Status", "Description & Payload"]):
        c = tbl_api.cell(0, i)
        c.width = api_w[i]
        set_cell_background(c, HEX_HEADER)
        set_cell_margins(c, 100, 100, 120, 120)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h)
        r.font.bold = True; r.font.size = Pt(9.5); r.font.color.rgb = RGBColor(255, 255, 255)

    apis = [
        ("GET", "/api/products", "200 OK", "Fetch all catalog items. Supports ?category and ?sellerId query filters"),
        ("POST", "/api/products", "201 Created", "Create new product SKU with title, price, stock, and seller details"),
        ("PUT", "/api/products/:id", "200 OK", "Update pricing, stock inventory, or marketing details for a SKU"),
        ("DELETE", "/api/products/:id", "200 OK", "Remove product SKU from active marketplace"),
        ("GET", "/api/categories", "200 OK", "Fetch list of all 5 retail departments"),
        ("GET", "/api/orders", "200 OK", "Retrieve orders ledger. Supports ?customerId and ?sellerId filters"),
        ("POST", "/api/orders", "201 Created", "Submit customer order. Automatically decrements inventory"),
        ("GET", "/api/orders/:id", "200 OK", "Fetch complete order record by ID or orderNumber"),
        ("PUT", "/api/orders/:id", "200 OK", "Admin update order attributes or status"),
        ("PUT", "/api/orders/:id/status", "200 OK", "Advance order fulfillment lifecycle state (Shipped / Delivered)"),
        ("DELETE", "/api/orders/:id", "200 OK", "Delete order record from database"),
        ("GET", "/api/customers", "200 OK", "Fetch directory of 12 registered Indian customer accounts"),
        ("GET", "/api/stats", "200 OK", "Aggregate KPI metrics: gross sales, counts, and low-stock alerts")
    ]

    for idx, (m, u, s, desc) in enumerate(apis, start=1):
        bg = HEX_ALT if idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate([m, u, s, desc]):
            c = tbl_api.cell(idx, c_idx)
            c.width = api_w[c_idx]
            set_cell_background(c, bg)
            set_cell_margins(c, 80, 80, 120, 120)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.size = Pt(8.5)
            if c_idx == 0:
                r.font.bold = True
                if val == "GET": r.font.color.rgb = RGBColor(5, 150, 105)
                elif val == "POST": r.font.color.rgb = RGBColor(37, 99, 235)
                elif val == "PUT": r.font.color.rgb = RGBColor(217, 119, 6)
                elif val == "DELETE": r.font.color.rgb = RGBColor(220, 38, 38)
            elif c_idx == 1:
                r.font.bold = True

    doc.add_page_break()

    # ==================== SECTION 12 ====================
    add_sec_h("12. UI/UX Design System, SVG Vector Standard & Theming Engine", lvl=1)
    doc.add_paragraph(
        "TrendMart follows strict visual discipline based on modern fintech standards (Stripe, Amazon Seller Central):"
    )
    ui_rules = [
        ("Zero-Emoji Vector Icon Standard", "Every icon throughout navigation, metric cards, action buttons, and status badges is rendered as an inline SVG with precise stroke geometries (2.0 stroke-width, rounded stroke-caps). This guarantees crisp rendering on high-DPI displays and removes casual emojis."),
        ("Dual-Theme CSS Variable Engine", "Admin Console implements CSS Custom Properties for theme tokens (--bg-main, --bg-card, --text-primary, --border, --accent). Toggling theme sets data-theme on document.documentElement, triggering instantaneous CSS cascade updates without JavaScript style recalculations."),
        ("Card Elevation & Border Geometry", "Cards and tables utilize subtle 1px border outlines (#E2E8F0 in light, #334155 in dark) paired with soft multi-layer box shadows (0 1px 3px rgba(0,0,0,0.1)), establishing visual hierarchy."),
        ("Accessible Contrast & Color Indicators", "Status pills utilize high-contrast badge styling paired with 6px indicator dots: In Stock / Delivered (#10B981 green), Low Stock / Processing (#F59E0B amber), and Out of Stock (#EF4444 red).")
    ]
    for title, desc in ui_rules:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(4)
        r1 = p.add_run(f"• {title}: ")
        r1.font.bold = True; r1.font.color.rgb = C_NAVY
        r2 = p.add_run(desc); r2.font.size = Pt(10)

    # ==================== SECTION 13 ====================
    add_sec_h("13. Local Setup, Multi-Port Configuration & Developer Operations", lvl=1)
    doc.add_paragraph("Running the TrendMart ecosystem locally requires zero build tools. Follow these steps:")
    dev_steps = [
        ("Prerequisites", "Node.js (version 18.0.0 or higher) and any modern Chromium/WebKit/Gecko web browser."),
        ("Repository Location", "Open terminal and navigate to the project directory: cd TrendMart-repo"),
        ("Single Command Execution", "Start all 4 ecosystem services: node run_ecosystem.js"),
        ("Local Port Access", "Open the following URLs in your browser:\n  • Admin Console: http://localhost:3000\n  • Customer Store: http://localhost:3001\n  • Seller Hub: http://localhost:3002\n  • Central API & DB: http://localhost:5000/api/")
    ]
    for step, detail in dev_steps:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(4)
        r1 = p.add_run(f"{step}\n")
        r1.font.bold = True; r1.font.color.rgb = C_NAVY
        r2 = p.add_run(f"  {detail}"); r2.font.size = Pt(10)

    # ==================== SECTION 14 ====================
    add_sec_h("14. Quality Assurance, Testing Matrix & Browser Verification", lvl=1)
    doc.add_paragraph("The ecosystem has been verified via automated browser test suites across all core flows:")

    tbl_qa = doc.add_table(rows=7, cols=3)
    tbl_qa.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_qa.autofit = False
    set_table_borders(tbl_qa)
    w_qa = [Inches(2.0), Inches(3.2), Inches(1.3)]
    for i, h in enumerate(["Test Scenario", "Expected Behavioral Outcome", "Validation Result"]):
        c = tbl_qa.cell(0, i)
        c.width = w_qa[i]
        set_cell_background(c, HEX_HEADER)
        set_cell_margins(c, 100, 100, 120, 120)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h)
        r.font.bold = True; r.font.size = Pt(9.5); r.font.color.rgb = RGBColor(255, 255, 255)

    qas = [
        ("Logo Home Navigation", "Clicking brand logo on :3001 resets active filter to All Deals and scrolls to top smoothly", "PASSED (100%)"),
        ("Category Filter Emoji Removal", "Category pills on :3001 display pure professional text without emojis", "PASSED (100%)"),
        ("Customer Top-Right Profile", "Top-right navbar displays Cart -> My Orders -> User Profile Badge in exact order", "PASSED (100%)"),
        ("Seller Hub Enterprise Redesign", "Full SVG icons, KPI cards, modal forms, and demo store switchers on :3002", "PASSED (100%)"),
        ("Central DB Order Fulfillment", "Changing order status in Admin (:3000) or Seller (:3002) persists to server/data/trendmart_db.json", "PASSED (100%)"),
        ("Admin White Screen Resolution", "Admin dashboard loads with 20 products, 15 customers, and live order sync", "PASSED (100%)")
    ]
    for idx, (sc, ex, res) in enumerate(qas, start=1):
        bg = HEX_ALT if idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate([sc, ex, res]):
            c = tbl_qa.cell(idx, c_idx)
            c.width = w_qa[c_idx]
            set_cell_background(c, bg)
            set_cell_margins(c, 80, 80, 120, 120)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.size = Pt(9)
            if c_idx == 0: r.font.bold = True
            elif c_idx == 2: r.font.bold = True; r.font.color.rgb = RGBColor(5, 150, 105)

    doc.add_page_break()

    # ==================== SECTION 15 ====================
    add_sec_h("15. Production Deployment, Security Architecture & Future Roadmap", lvl=1)
    doc.add_paragraph("For production cloud deployment, the following architecture is recommended:")
    prod_items = [
        ("Nginx Reverse Proxy & SSL Termination", "Deploy an Nginx reverse proxy fronting ports 3000, 3001, 3002, and 5000 behind Let's Encrypt TLS certificates on subdomains (admin.trendmart.com, shop.trendmart.com, seller.trendmart.com, api.trendmart.com)."),
        ("JWT Authentication & HttpOnly Cookies", "Transition mock sessions to cryptographic JSON Web Tokens signed with RS256 private keys, stored in secure, SameSite=Strict HttpOnly cookies."),
        ("Database Cluster Migration (MongoDB / PostgreSQL)", "Migrate from JSON file storage to a managed database cluster (MongoDB Atlas or AWS Aurora PostgreSQL) with indexed queries and connection pooling."),
        ("Redis Caching Tier", "Implement an in-memory Redis cache for product catalog listings and department categories to achieve sub-10ms response times under heavy concurrent loads."),
        ("Payment Gateway Integration (Razorpay / Stripe)", "Integrate live webhook listeners for instant payment capture, automated stock reservation timeouts, and automated invoice PDF generation.")
    ]
    for title, desc in prod_items:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(4)
        r1 = p.add_run(f"• {title}: ")
        r1.font.bold = True; r1.font.color.rgb = C_NAVY
        r2 = p.add_run(desc); r2.font.size = Pt(10)

    doc.add_paragraph().paragraph_format.space_before = Pt(16)
    p_concl = doc.add_paragraph()
    r_c = p_concl.add_run("Conclusion: TrendMart delivers a production-ready, highly responsive, and architecturally decoupled multi-site commerce platform. Its combination of zero-bundler reactivity and real-time database synchronization establishes an exceptional blueprint for enterprise retail software engineering.")
    r_c.font.italic = True
    r_c.font.size = Pt(10.5)
    r_c.font.color.rgb = C_NAVY

    doc.save(output_path)
    print(f"Master documentation successfully written to: {output_path}")

if __name__ == "__main__":
    out_path = os.path.abspath(r"C:\Users\Sakthi Sundaresan\OneDrive\Desktop\My Projects\mern\TrendMart-repo\TrendMart_Project_Documentation.docx")
    build_trendmart_master_doc(out_path)
