interface Item {
    id: number;
    title: string;
    image: string;
}

interface Point {
    id: number;
    name: string;
    image: string;
    phone: string;
    email: string;
    latitude: number;
    longitude: nunmber;
    uf: string;
    city: string;
    items: Item[];
}

interface RequestPoint {
    name: string;
    image: string;
    phone: string;
    email: string;
    latitude: number;
    longitude: nunmber;
    uf: string;
    city: string;
    items: string;
}

interface ReponsePoint {
    name: string;
    image: string;
    phone: string;
    email: string;
    latitude: number;
    longitude: nunmber;
    uf: string;
    city: string;
    items: string[];
}

interface PointItem {
    id: number;
    point_id: number;
    item_id: number;
}