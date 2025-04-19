import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    DashboardOutlined,
    UserOutlined,
    SettingOutlined,
    TeamOutlined,
    MessageOutlined,
    TagsOutlined,
    FormOutlined,
    GroupOutlined,
    MailOutlined,
    BarChartOutlined
} from '@ant-design/icons';

const AdminSidebar = () => {
    const location = useLocation();

    const menuItems = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
            path: '/admin/dashboard'
        },
        {
            key: 'users',
            icon: <UserOutlined />,
            label: 'Users',
            path: '/admin/users'
        },
        {
            key: 'campaigns',
            icon: <MailOutlined />,
            label: 'Campaigns',
            path: '/admin/campaigns'
        },
        {
            key: 'automations',
            icon: <BarChartOutlined />,
            label: 'Automations',
            path: '/admin/automations'
        },
        {
            key: 'contacts',
            icon: <TeamOutlined />,
            label: 'Contacts',
            path: '/admin/contacts'
        },
        {
            key: 'forms',
            icon: <FormOutlined />,
            label: 'Forms',
            path: '/admin/forms'
        },
        {
            key: 'groups',
            icon: <GroupOutlined />,
            label: 'Groups',
            path: '/admin/groups'
        },
        {
            key: 'messages',
            icon: <MessageOutlined />,
            label: 'Messages',
            path: '/admin/messages'
        },
        {
            key: 'tags',
            icon: <TagsOutlined />,
            label: 'Tags',
            path: '/admin/tags'
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Settings',
            path: '/admin/settings'
        }
    ];

    return (
        <div className="admin-sidebar">
            <div className="logo">
                <h2>Admin Panel</h2>
            </div>
            <nav>
                <ul>
                    {menuItems.map(item => (
                        <li key={item.key}>
                            <Link
                                to={item.path}
                                className={location.pathname === item.path ? 'active' : ''}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default AdminSidebar; 