# Ingabo Marks Track

A comprehensive academic monitoring and communication platform for students, moms (family guardians), social workers, and administrators.

## 🎯 Features

### Multi-Role System
- **Admin**: Manage families, create users, view activity logs
- **Social Worker**: Approve marks, monitor all families, manage trending posts, monitor all chats
- **Mom**: View students in family, monitor marks and attendance, chat with students
- **Student**: Add marks and attendance, view own data, chat with mom and social worker

### Core Functionality
- ✅ **Marks Tracking**: Students submit marks for social worker approval
- ✅ **Attendance Management**: Students record their attendance
- ✅ **Family-Based Structure**: Complete data isolation between families
- ✅ **Real-Time Chat**: Instagram-like messaging system with direct and group chats
- ✅ **Trending Updates**: Social workers post announcements visible to all users
- ✅ **Activity Logs**: Comprehensive tracking of all system actions
- ✅ **Secure Authentication**: Password-protected sessions with auto-logout
- ✅ **Role-Based Access Control**: Strict permissions per role

## 🔐 Default Credentials

**Admin Account:**
- Username: `ingabo`
- Password: `ingabo1`
- ⚠️ You will be required to change the password on first login

## 📊 System Workflow

### Admin Setup
1. Login with default credentials
2. Change password (required on first login)
3. Create families via "Manage Families"
4. Create social workers, moms, and students via "Manage Users"
5. Assign moms and students to families

### Social Worker Operations
1. Review and approve/reject student marks
2. Monitor all families and students
3. Create trending posts and announcements
4. Monitor all chat conversations for safety

### Mom Functions
1. View all students in assigned family
2. Monitor students' marks and attendance
3. Chat with students in family
4. View trending updates

### Student Actions
1. Add marks (pending social worker approval)
2. Record attendance
3. Chat with mom and social worker
4. View own marks and attendance
5. Read trending updates

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed before storage
- **Session Management**: Automatic 30-minute session timeout
- **Activity Logging**: All user actions are logged
- **Family Isolation**: Strict data separation between families
- **Role-Based Access**: Users can only access data permitted by their role
- **Password Change Requirement**: Admin must change default password

## 💬 Chat System

### Conversation Types
1. **Direct Chats**: Student ↔ Mom, Student ↔ Social Worker
2. **Family Group Chat**: All family members (mom + students)
3. **Social Worker Monitoring**: Can view all conversations

### Chat Features
- Real-time messaging
- Read/unread status
- Timestamps
- User roles displayed
- Conversation history

## 📱 Responsive Design

The platform is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## 🎨 User Interface

- Clean, modern design with Tailwind CSS
- Intuitive navigation
- Color-coded status badges
- Dashboard overviews for each role
- Quick action cards

## ⚙️ Technical Stack

- **Frontend**: React with TypeScript
- **Routing**: React Router v7 (Data Mode)
- **State Management**: React Context API
- **Data Storage**: LocalStorage (simulated backend)
- **UI Components**: Radix UI + Tailwind CSS
- **Icons**: Lucide React

## 📝 Notes

- This is a frontend-only demonstration with simulated backend
- Data is stored in browser localStorage
- For production use, integrate with a real database and authentication system
- Not suitable for collecting PII or highly sensitive data without proper backend security

## 🚀 Getting Started

1. Open the application
2. Login with admin credentials (ingabo / ingabo1)
3. Change the admin password
4. Create families and users
5. Start using the system!

---

**Built for academic monitoring and family communication**
