# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Dealership Management System (DMS)** for motorcycle dealerships - specifically a comprehensive cloud-based system for managing dealership operations. The project is currently in the design and planning phase, containing HTML prototypes and design documentation.

## Project Structure

```
/docs/
  ├── idea.md                    # Core project requirements and feature specifications
  └── designs/                   # HTML prototype designs
      ├── customer.html          # Customer management interface
      ├── finance-management.html # Financial operations interface  
      ├── inventory.html         # Inventory management interface
      ├── sales-pipeline.html    # Sales pipeline tracking interface
      └── service-department.html # Service department interface
```

## System Architecture

The DMS is designed as an integrated system with these core modules:

### Core Modules
- **Inventory Management**: Real-time tracking of motorcycles, parts, and accessories
- **Customer Relationship Management (CRM)**: 360-degree customer view with lead management
- **Sales Management**: Digital sales processes from inquiry to delivery
- **Service Management**: Workshop management with appointment scheduling
- **Financial Integration**: Automated invoicing and accounting integration

### Design System
All HTML prototypes use a consistent design system:
- **CSS Framework**: Tailwind CSS via CDN
- **Typography**: Inter font family
- **Color Scheme**: 
  - Primary: `#3d98f4` (blue)
  - Secondary: `#e0f2fe` (light blue)
  - Background: `#f9f9f9` (light gray)
  - Text Primary: `#111827` (dark gray)
  - Text Secondary: `#6b7280` (medium gray)

## Development Guidelines

### When Implementing Features
1. **Follow the established design system** - Use the CSS custom properties defined in existing HTML files
2. **Maintain module separation** - Each core module (inventory, CRM, sales, service, finance) should be developed as separate components
3. **Reference the idea.md** - All features should align with the comprehensive requirements outlined in docs/idea.md
4. **Responsive Design** - All interfaces use Tailwind's responsive utilities and should work across devices

### Technology Stack Considerations
- The project currently contains only HTML prototypes
- When transitioning to a full application, consider the integration requirements mentioned in idea.md:
  - Cloud-based architecture
  - Real-time inventory tracking
  - Automated stock alerts
  - Third-party accounting integration (Xero, QuickBooks)
  - Payment processing capabilities

### File Organization
- HTML prototypes serve as the visual reference for the final implementation
- Each HTML file represents a major module/feature area
- The design patterns in these files should be extracted into reusable components when building the actual application

## Development Status
⚠️ **This is currently a design/planning phase project** containing HTML prototypes and requirements documentation. No build tools, package managers, or runtime code exists yet.