import {
    Shapes, // Categories Icon (using Shapes to match the triangle/square/circle in Image 2)
    Weight, // Weight Loss
    Mars, // ED
    Smile, // Acne (using Smile as a proxy for face)
    Brain, // Migraine 
    Stethoscope, // Asthma
    Bandage, // Eczema & Dermatitis
    Plane, // Jet Lag
    Wind, // Hair Loss (using wind as representation for blowdryer proxy)
    CalendarClock, // Period Delay 
    Activity, // Joint and Muscle Pain (Using Activity as proxy for standing person)
    Bug // Bacterial Vaginosis 
} from 'lucide-react';
import type { NavItem } from '../types';

export const categoriesMenu: NavItem = {
    title: 'Categories',
    path: '/orders/category',
    icon: Shapes,
    children: [
        { title: 'Weight Loss', path: '/orders/category/weight-loss', icon: Weight },
        { title: 'ED', path: '/orders/category/ed', icon: Mars },
        { title: 'Acne', path: '/orders/category/acne', icon: Smile },
        { title: 'Migraine', path: '/orders/category/migraine', icon: Brain },
        { title: 'Asthma', path: '/orders/category/asthma', icon: Stethoscope },
        { title: 'Eczema & Dermatitis', path: '/orders/category/eczema-dermatitis', icon: Bandage },
        { title: 'Jet Lag', path: '/orders/category/jet-lag', icon: Plane },
        { title: 'Hair Loss', path: '/orders/category/hair-loss', icon: Wind },
        { title: 'Period Delay', path: '/orders/category/period-delay', icon: CalendarClock },
        { title: 'Acid Reflux and Heartburn', path: '/orders/category/acid-reflux', icon: Stethoscope },
        { title: 'Joint and Muscle Pain', path: '/orders/category/joint-pain', icon: Activity },
        { title: 'Bacterial Vaginosis', path: '/orders/category/bacterial-vaginosis', icon: Bug }
    ]
};
