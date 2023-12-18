export default interface Quote {
    id: string | null;
    text: string;
    author: string;
    createdAt: Date | null;
}