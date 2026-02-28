const ids = [
    "1522202176988-66273c2fd55f", "1531297172-8700d5a3ece1", "1507238691740-14c0122462e1",
    "1498050108023-c5249f4df085", "1460925890817-c6eebc816db7", "1504384308090-c894fdcc538d",
    "1473186578172-c11a0ce2cbdd", "1505909182942-e2f09aee3e89", "1517694712202-14dd9538aa97",
    "1461749280684-dccba630e2f6", "1481482257018-a77ddbbafdf8", "1550745165-9bc0b252726f",
    "1454165804606-c3d57bc86b40", "1472438222826-b48aa9822a94", "1480694313141-fce5e697ee25",
    "1499951360447-b19be8fe80f5", "1555421689-d68471e189f2", "1522542550221-31fd19575a2d",
    "1516321497487-e288fb19713f"
];

ids.forEach(async (id) => {
    const url = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=200&h=140`;
    try {
        const res = await fetch(url);
        console.log(`${id}: ${res.status}`);
    } catch (e) {
        console.log(`${id}: error`);
    }
});
