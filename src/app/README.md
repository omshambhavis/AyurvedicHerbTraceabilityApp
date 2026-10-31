# AyurTrace - Ayurvedic Herb Traceability App

A Python-based mobile-responsive web application for tracking Ayurvedic herbs from farm to consumer, built with Streamlit.

## Features

### 🌿 Browse Herbs
- Search and filter herbs by name, scientific name, origin, or farmer
- View herb cards with images, quality badges, and basic information
- Quality classifications: Premium, Organic, Standard

### 📱 QR Code Scanning
- Simulated QR code scanning functionality
- Manual code entry option
- Real-time herb lookup by traceability ID

### 🕐 Recent Scans
- Track recently viewed herbs
- Quick access to previously scanned items

### 📋 Detailed Herb Information
- Complete herb profiles with images
- Ayurvedic benefits and properties
- Quality certifications and badges
- Source farm information with farmer details
- Complete traceability timeline from cultivation to retail

### 🔗 Traceability Timeline
- Visual timeline showing herb journey through supply chain
- Stages: Cultivation → Harvest → Processing → Quality Check → Packaging → Shipping → Retail
- Detailed information for each stage including dates, locations, and processing details
- Interactive expandable details for each timeline event

## Installation

1. **Clone or download the application files**

2. **Install required dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application:**
   ```bash
   streamlit run main.py
   ```

4. **Access the app:**
   - Open your web browser and go to `http://localhost:8501`
   - The app is mobile-responsive and works well on smartphones and tablets

## Usage

### Browsing Herbs
1. Use the "Browse" tab to view all available herbs
2. Use the search box to filter by herb name, scientific name, origin, or farmer
3. Click "View Details" on any herb card to see complete information

### Scanning QR Codes
1. Go to the "Scan" tab
2. Click "Start Scanning" to simulate QR code scanning (automatically finds Turmeric Root)
3. Or click "Enter Code Manually" and enter a herb ID like `AYU-TUR-2024-001234`

### Viewing Herb Details
- Complete herb profile with high-quality images
- Ayurvedic benefits and health properties
- Quality certifications (AYUSH, Organic, Fair Trade)
- Source farm information with farmer details
- Interactive traceability timeline showing the complete journey

### Sample Herb IDs for Testing
- `AYU-TUR-2024-001234` - Turmeric Root (Premium)
- `AYU-ASH-2024-002156` - Ashwagandha Root (Organic)
- `AYU-NIM-2024-003287` - Neem Leaves (Standard)

## Technology Stack

- **Framework:** Streamlit (Python web framework)
- **UI/UX:** Custom CSS for mobile-first responsive design
- **Images:** Unsplash integration for high-quality herb and farm images
- **Data Management:** Python dictionaries and classes for herb data structure
- **State Management:** Streamlit session state for navigation and user interactions

## Mobile Design Features

- **Responsive Layout:** Optimized for mobile devices with touch-friendly interfaces
- **Mobile-First CSS:** Custom styling for optimal mobile viewing experience
- **Touch Navigation:** Tab-based navigation suitable for mobile interaction
- **Optimized Images:** Properly sized images for mobile bandwidth
- **Intuitive UI:** Large buttons and clear visual hierarchy for mobile usability

## Data Structure

Each herb contains comprehensive information:
- Unique traceability ID
- Name and scientific classification
- High-quality product and farm images
- Geographic origin and harvest details
- Quality certifications and farmer information
- Detailed Ayurvedic benefits
- Processing methods and expiry dates
- Complete supply chain timeline

## Educational Value

This app demonstrates:
- **Supply Chain Transparency:** Complete farm-to-consumer tracking
- **Quality Assurance:** Certification tracking and verification
- **Traditional Medicine:** Ayurvedic herb properties and benefits
- **Sustainable Agriculture:** Organic farming practices and farmer profiles
- **Consumer Trust:** Building confidence through transparency

## Future Enhancements

Potential improvements for a production version:
- Real QR code scanning using camera integration
- Database integration for dynamic herb data
- User authentication and personalized experiences
- Real-time supply chain updates
- Integration with blockchain for immutable traceability
- Multi-language support for global accessibility
- Offline functionality for rural areas

## License

This is a prototype application for educational and demonstration purposes.