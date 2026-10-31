import streamlit as st
import time
from datetime import datetime
from typing import Dict, List, Any, Optional
import base64

# Configure the Streamlit page
st.set_page_config(
    page_title="AyurTrace - Herb Traceability",
    page_icon="🌿",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom CSS for mobile-first design
st.markdown("""
<style>
    .main-header {
        background: white;
        padding: 1rem;
        border-bottom: 1px solid #e5e7eb;
        margin-bottom: 1rem;
    }
    
    .herb-card {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        padding: 1rem;
        margin-bottom: 0.75rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: box-shadow 0.2s;
    }
    
    .herb-card:hover {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .quality-badge {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.75rem;
        font-weight: 500;
    }
    
    .premium { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
    .organic { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
    .standard { background: #f8fafc; color: #374151; border: 1px solid #e2e8f0; }
    
    .timeline-event {
        display: flex;
        gap: 0.75rem;
        margin-bottom: 1rem;
    }
    
    .timeline-icon {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid;
        font-size: 0.875rem;
    }
    
    .completed {
        background: #f0fdf4;
        border-color: #22c55e;
        color: #16a34a;
    }
    
    .pending {
        background: #f9fafb;
        border-color: #d1d5db;
        color: #9ca3af;
    }
    
    .scan-area {
        background: #f9fafb;
        border: 2px dashed #d1d5db;
        border-radius: 0.5rem;
        padding: 2rem;
        text-align: center;
        margin: 1rem 0;
    }
</style>
""", unsafe_allow_html=True)

class HerbData:
    """Class to manage herb data and operations"""
    
    @staticmethod
    def get_herbs() -> List[Dict[str, Any]]:
        return [
            {
                "id": "AYU-TUR-2024-001234",
                "name": "Turmeric Root",
                "scientific_name": "Curcuma longa",
                "image": "https://images.unsplash.com/photo-1634114852247-5fe1bab55b22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxheXVydmVkaWMlMjBoZXJicyUyMHNwaWNlcyUyMHR1cm1lcmljfGVufDF8fHx8MTc1NzUxMzMzNXww&ixlib=rb-4.1.0&q=80&w=400",
                "farm_image": "https://images.unsplash.com/photo-1693593785503-5bfee6d1d5ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZmFybSUyMGZpZWxkJTIwYWdyaWN1bHR1cmV8ZW58MXx8fHwxNzU3NTEzMzM4fDA&ixlib=rb-4.1.0&q=80&w=400",
                "origin": "Wayanad, Kerala",
                "harvest_date": "2024-03-15",
                "certifications": ["AYUSH Certified", "Organic", "Fair Trade"],
                "quality": "premium",
                "farmer": "Ravi Kumar",
                "farm_location": "Organic Farm, Wayanad District, Kerala",
                "description": "Premium quality turmeric root with high curcumin content. Cultivated using traditional organic methods passed down through generations.",
                "benefits": [
                    "Natural anti-inflammatory properties",
                    "Supports immune system health", 
                    "Aids digestion and liver function",
                    "Promotes healthy skin and wound healing",
                    "May help reduce joint pain and stiffness"
                ],
                "processing_method": "Sun-dried and ground using traditional stone mills",
                "expiry_date": "2026-03-15"
            },
            {
                "id": "AYU-ASH-2024-002156",
                "name": "Ashwagandha Root",
                "scientific_name": "Withania somnifera",
                "image": "https://images.unsplash.com/photo-1738428302791-c8c6f67496c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2h3YWdhbmRoYSUyMGhlcmIlMjBwbGFudHxlbnwxfHx8fDE3NTc1MTMzNDF8MA&ixlib=rb-4.1.0&q=80&w=400",
                "farm_image": "https://images.unsplash.com/photo-1693593785503-5bfee6d1d5ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZmFybSUyMGZpZWxkJTIwYWdyaWN1bHR1cmV8ZW58MXx8fHwxNzU3NTEzMzM4fDA&ixlib=rb-4.1.0&q=80&w=400",
                "origin": "Rajasthan, India",
                "harvest_date": "2024-02-20",
                "certifications": ["AYUSH Certified", "Organic"],
                "quality": "organic",
                "farmer": "Mohan Singh",
                "farm_location": "Rajasthan Desert Farms, Jodhpur",
                "description": "High-quality ashwagandha root known for its adaptogenic properties. Grown in the arid climate of Rajasthan for maximum potency.",
                "benefits": [
                    "Helps manage stress and anxiety",
                    "Supports healthy sleep patterns",
                    "May improve physical performance",
                    "Supports thyroid function",
                    "Helps maintain healthy cortisol levels"
                ],
                "processing_method": "Shade-dried and powdered using modern facilities",
                "expiry_date": "2026-02-20"
            },
            {
                "id": "AYU-NIM-2024-003287",
                "name": "Neem Leaves",
                "scientific_name": "Azadirachta indica",
                "image": "https://images.unsplash.com/photo-1634114852247-5fe1bab55b22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxheXVydmVkaWMlMjBoZXJicyUyMHNwaWNlcyUyMHR1cm1lcmljfGVufDF8fHx8MTc1NzUxMzMzNXww&ixlib=rb-4.1.0&q=80&w=400",
                "farm_image": "https://images.unsplash.com/photo-1693593785503-5bfee6d1d5ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZmFybSUyMGZpZWxkJTIwYWdyaWN1bHR1cmV8ZW58MXx8fHwxNzU3NTEzMzM4fDA&ixlib=rb-4.1.0&q=80&w=400",
                "origin": "Tamil Nadu, India",
                "harvest_date": "2024-01-10",
                "certifications": ["AYUSH Certified"],
                "quality": "standard",
                "farmer": "Lakshmi Devi",
                "farm_location": "Coimbatore District, Tamil Nadu",
                "description": "Fresh neem leaves harvested from mature trees. Known for their bitter taste and powerful medicinal properties.",
                "benefits": [
                    "Natural antibacterial and antifungal properties",
                    "Supports healthy skin",
                    "May help maintain blood sugar levels",
                    "Supports oral health",
                    "Aids in detoxification"
                ],
                "processing_method": "Air-dried under controlled conditions",
                "expiry_date": "2025-01-10"
            }
        ]
    
    @staticmethod
    def get_timeline_events(herb: Dict[str, Any]) -> List[Dict[str, Any]]:
        return [
            {
                "id": "1",
                "stage": "cultivation",
                "date": "2024-01-15",
                "location": herb["farm_location"],
                "description": f"Organic cultivation started by {herb['farmer']}",
                "completed": True,
                "details": {
                    "farmer": herb["farmer"],
                    "soil_type": "Red laterite soil",
                    "irrigation": "Drip irrigation",
                    "fertilizer": "Organic compost"
                }
            },
            {
                "id": "2",
                "stage": "harvest",
                "date": herb["harvest_date"],
                "location": herb["farm_location"],
                "description": "Herbs harvested at optimal maturity",
                "completed": True,
                "details": {
                    "harvest_time": "Early morning",
                    "moisture_content": "12%",
                    "quality_grade": "Grade A"
                }
            },
            {
                "id": "3",
                "stage": "processing",
                "date": "2024-03-20",
                "location": "Ayurvedic Processing Unit, Kerala",
                "description": herb["processing_method"],
                "completed": True,
                "details": {
                    "method": herb["processing_method"],
                    "temperature": "Below 40°C",
                    "duration": "Natural drying"
                }
            },
            {
                "id": "4",
                "stage": "quality_check",
                "date": "2024-03-25",
                "location": "AYUSH Certified Lab, Mumbai",
                "description": "Quality testing and certification completed",
                "completed": True,
                "details": {
                    "lab_name": "AYUSH Certified Lab",
                    "test_results": "Passed all parameters",
                    "certification": "AYUSH Approved"
                }
            },
            {
                "id": "5",
                "stage": "packaging",
                "date": "2024-04-01",
                "location": "Packaging Unit, Bangalore",
                "description": "Sealed in food-grade packaging",
                "completed": True,
                "details": {
                    "package_type": "Vacuum sealed",
                    "batch_number": herb["id"],
                    "expiry_date": herb["expiry_date"]
                }
            },
            {
                "id": "6",
                "stage": "shipping",
                "date": "2024-04-05",
                "location": "Distribution Center",
                "description": "Shipped to retail partner",
                "completed": True
            },
            {
                "id": "7",
                "stage": "retail",
                "date": "2024-04-08",
                "location": "Ayurvedic Store, Delhi",
                "description": "Available for purchase",
                "completed": True
            }
        ]

def render_header():
    """Render the app header"""
    st.markdown("""
    <div class="main-header">
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
            <div style="width: 2rem; height: 2rem; background: #16a34a; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center;">
                🌿
            </div>
            <div>
                <h1 style="margin: 0; font-size: 1.125rem; font-weight: 600; color: #111827;">AyurTrace</h1>
                <p style="margin: 0; font-size: 0.75rem; color: #6b7280;">Herb Traceability</p>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

def render_herb_card(herb: Dict[str, Any], key: str):
    """Render a herb card"""
    quality_class = herb["quality"]
    
    card_html = f"""
    <div class="herb-card">
        <div style="display: flex; gap: 0.75rem;">
            <div style="width: 4rem; height: 4rem; border-radius: 0.5rem; overflow: hidden; flex-shrink: 0;">
                <img src="{herb['image']}" alt="{herb['name']}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="flex: 1; min-width: 0;">
                <div style="display: flex; align-items: start; justify-content: space-between; margin-bottom: 0.25rem;">
                    <div>
                        <h3 style="margin: 0; font-weight: 500; color: #111827; font-size: 0.875rem;">{herb['name']}</h3>
                        <p style="margin: 0; font-size: 0.75rem; color: #6b7280; font-style: italic;">{herb['scientific_name']}</p>
                    </div>
                    <span class="quality-badge {quality_class}">{herb['quality']}</span>
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                    <div style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; color: #6b7280;">
                        📍 <span>{herb['origin']}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; color: #6b7280;">
                        📅 <span>Harvested {herb['harvest_date']}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; color: #6b7280;">
                        🛡️ <span>{', '.join(herb['certifications'][:2])}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    """
    
    if st.button("View Details", key=f"btn_{key}", help=f"View details for {herb['name']}"):
        st.session_state.selected_herb = herb["id"]
        st.session_state.current_view = "detail"
        st.rerun()
    
    st.markdown(card_html, unsafe_allow_html=True)

def render_timeline(events: List[Dict[str, Any]], herb_id: str):
    """Render the traceability timeline"""
    st.subheader(f"🔗 Traceability Journey - ID: {herb_id}")
    
    for i, event in enumerate(events):
        stage_icons = {
            "cultivation": "🌱",
            "harvest": "📦",
            "processing": "🏭",
            "quality_check": "✅",
            "packaging": "📦",
            "shipping": "🚛",
            "retail": "🏪"
        }
        
        icon = stage_icons.get(event["stage"], "✅")
        status_class = "completed" if event["completed"] else "pending"
        
        # Timeline event
        col1, col2 = st.columns([1, 10])
        
        with col1:
            st.markdown(f"""
            <div class="timeline-icon {status_class}">
                {icon}
            </div>
            """, unsafe_allow_html=True)
        
        with col2:
            stage_name = event["stage"].replace("_", " ").title()
            color = "#111827" if event["completed"] else "#6b7280"
            
            st.markdown(f"""
            <div style="margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                    <h4 style="margin: 0; font-weight: 500; color: {color}; font-size: 0.875rem;">{stage_name}</h4>
                    <span style="font-size: 0.75rem; color: #6b7280;">{event['date']}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.25rem; margin-bottom: 0.5rem;">
                    <span style="font-size: 0.75rem; color: #6b7280;">📍 {event['location']}</span>
                </div>
                <p style="margin: 0; font-size: 0.75rem; color: #6b7280; margin-bottom: 0.5rem;">{event['description']}</p>
            </div>
            """, unsafe_allow_html=True)
            
            # Show details if available
            if event.get("details"):
                with st.expander("View Details", expanded=False):
                    for key, value in event["details"].items():
                        st.write(f"**{key.replace('_', ' ').title()}:** {value}")
        
        # Add connecting line except for last item
        if i < len(events) - 1:
            st.markdown("""
            <div style="margin-left: 1rem; width: 2px; height: 1rem; background: #d1d5db;"></div>
            """, unsafe_allow_html=True)

def render_herb_detail(herb: Dict[str, Any]):
    """Render detailed herb view"""
    # Back button
    if st.button("← Back to Browse", key="back_btn"):
        st.session_state.current_view = "main"
        st.rerun()
    
    # Herb image and basic info
    st.image(herb["image"], caption=herb["name"], use_container_width=True)
    
    col1, col2 = st.columns([3, 1])
    with col1:
        st.title(herb["name"])
        st.caption(f"*{herb['scientific_name']}*")
    with col2:
        quality_class = herb["quality"]
        st.markdown(f'<span class="quality-badge {quality_class}">{herb["quality"]}</span>', 
                   unsafe_allow_html=True)
    
    st.write(herb["description"])
    
    # Basic info grid
    col1, col2 = st.columns(2)
    with col1:
        st.metric("Origin", herb["origin"])
        st.metric("Farmer", herb["farmer"])
    with col2:
        st.metric("Harvest Date", herb["harvest_date"])
        st.metric("Expires", herb["expiry_date"])
    
    # Benefits
    st.subheader("🌿 Ayurvedic Benefits")
    for benefit in herb["benefits"]:
        st.write(f"• {benefit}")
    
    # Certifications
    st.subheader("🛡️ Certifications")
    cert_cols = st.columns(len(herb["certifications"]))
    for i, cert in enumerate(herb["certifications"]):
        with cert_cols[i]:
            st.success(f"🏆 {cert}")
    
    # Farm information
    st.subheader("📍 Source Farm")
    st.image(herb["farm_image"], caption="Source Farm", use_container_width=True)
    st.write(f"**Farmer:** {herb['farmer']}")
    st.write(f"**Location:** {herb['farm_location']}")
    st.write("**Farming Method:** Organic, Traditional Ayurvedic practices")
    
    # Timeline
    timeline_events = HerbData.get_timeline_events(herb)
    render_timeline(timeline_events, herb["id"])

def render_qr_scanner():
    """Render QR scanner interface"""
    st.subheader("📱 Scan Herb Code")
    
    st.markdown("""
    <div class="scan-area">
        <div style="font-size: 3rem; margin-bottom: 1rem;">📱</div>
        <p style="margin-bottom: 1rem; color: #6b7280;">Point your camera at the QR code on the herb package</p>
    </div>
    """, unsafe_allow_html=True)
    
    col1, col2 = st.columns(2)
    
    with col1:
        if st.button("📷 Start Scanning", key="scan_btn", use_container_width=True):
            with st.spinner("Scanning..."):
                time.sleep(2)  # Simulate scanning delay
                # Simulate successful scan
                scanned_code = "AYU-TUR-2024-001234"
                herbs = HerbData.get_herbs()
                herb = next((h for h in herbs if h["id"] == scanned_code), None)
                if herb:
                    st.session_state.selected_herb = scanned_code
                    st.session_state.current_view = "detail"
                    st.success(f"✅ Scanned: {herb['name']}")
                    time.sleep(1)
                    st.rerun()
                else:
                    st.error("❌ Herb not found. Please try again.")
    
    with col2:
        if st.button("🔍 Enter Code Manually", key="manual_btn", use_container_width=True):
            st.session_state.show_manual_input = True
    
    # Manual input
    if st.session_state.get("show_manual_input", False):
        manual_code = st.text_input("Enter herb traceability ID:", key="manual_code")
        if st.button("Search", key="search_manual"):
            if manual_code:
                herbs = HerbData.get_herbs()
                herb = next((h for h in herbs if h["id"] == manual_code), None)
                if herb:
                    st.session_state.selected_herb = manual_code
                    st.session_state.current_view = "detail"
                    st.success(f"✅ Found: {herb['name']}")
                    time.sleep(1)
                    st.rerun()
                else:
                    st.error("❌ Herb not found. Please check the code and try again.")
    
    st.info("💡 Scan or enter the unique code found on your Ayurvedic herb package to view its complete journey from farm to you.")

def main():
    """Main application function"""
    # Initialize session state
    if "current_view" not in st.session_state:
        st.session_state.current_view = "main"
    if "selected_herb" not in st.session_state:
        st.session_state.selected_herb = None
    if "recent_scans" not in st.session_state:
        st.session_state.recent_scans = ["AYU-TUR-2024-001234", "AYU-ASH-2024-002156"]
    
    # Render header
    render_header()
    
    # Handle detailed view
    if st.session_state.current_view == "detail" and st.session_state.selected_herb:
        herbs = HerbData.get_herbs()
        selected_herb_data = next((h for h in herbs if h["id"] == st.session_state.selected_herb), None)
        if selected_herb_data:
            render_herb_detail(selected_herb_data)
            return
    
    # Main navigation tabs
    tab1, tab2, tab3 = st.tabs(["🌿 Browse", "📱 Scan", "🕐 Recent"])
    
    with tab1:
        # Search functionality
        search_query = st.text_input("🔍 Search herbs, origins, farmers...", key="search")
        
        # Filter herbs based on search
        herbs = HerbData.get_herbs()
        if search_query:
            herbs = [
                herb for herb in herbs
                if (search_query.lower() in herb["name"].lower() or
                    search_query.lower() in herb["scientific_name"].lower() or
                    search_query.lower() in herb["origin"].lower() or
                    search_query.lower() in herb["farmer"].lower())
            ]
        
        # Display herbs
        if herbs:
            for i, herb in enumerate(herbs):
                render_herb_card(herb, f"browse_{i}")
        else:
            st.info("No herbs found matching your search criteria.")
    
    with tab2:
        render_qr_scanner()
    
    with tab3:
        if st.session_state.recent_scans:
            st.subheader("Recently Scanned Herbs")
            herbs = HerbData.get_herbs()
            for i, herb_id in enumerate(st.session_state.recent_scans):
                herb = next((h for h in herbs if h["id"] == herb_id), None)
                if herb:
                    render_herb_card(herb, f"recent_{i}")
        else:
            st.info("No recent scans")
            st.write("Use the Scan tab to track your first herb")

if __name__ == "__main__":
    main()