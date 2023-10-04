let Memory = require('../../src/model/data/memory')
let db

describe('memory', () => {

    beforeEach(() => {
        // re-import Memory if that would give you a fresh state:
        jest.resetModules();
        Memory = require('../../src/model/data/memory');
        db = Memory
    });

    test('writeFragment() should return nothing', async () => {

        const fragment = {
            "id": "12345",
            "ownerId": "aamfahim",
            "created": "2023-10-03",
            "updated": "2023-10-03",
            "type": "text/plain",
            "size": 256
        }

        await expect(db.writeFragment(fragment)).resolves.toBeUndefined();

    });

    test('readFragment() returns writeFragment() object', async () => {

        const fragment = {
            "id": "12345",
            "ownerId": "aamfahim",
            "created": "2023-10-03",
            "updated": "2023-10-03",
            "type": "text/plain",
            "size": 256
        }

        await db.writeFragment(fragment);
        const result = await db.readFragment(fragment.ownerId, fragment.id)
        expect(result).toBe(fragment);
    });

    test('writeFragmentData() returns nothing', async () => {

        const fragment = {
            "id": "12345",
            "ownerId": "aamfahim",
            "created": "2023-10-03",
            "updated": "2023-10-03",
            "type": "text/plain",
            "size": 256
        }

        await expect(db.writeFragmentData(fragment.ownerId, fragment.id, fragment)).resolves.toBeUndefined();
    });


    test('readFragmentData() returns writeFragmentData() object', async () => {

        const fragment = {
            "id": "12345",
            "ownerId": "aamfahim",
            "created": "2023-10-03",
            "updated": "2023-10-03",
            "type": "text/plain",
            "size": 256
        }

        await db.writeFragmentData(fragment.ownerId, fragment.id, fragment);
        const result = await db.readFragmentData(fragment.ownerId, fragment.id)
        expect(result).toBe(fragment);
    });


    test('listFragments() returns an array writeFragment() from db', async () => {

        const fragment1 = {
            "id": "12345",
            "ownerId": "aamfahim",
            "created": "2023-10-03",
            "updated": "2023-10-03",
            "type": "text/plain",
            "size": 256
        }

        const fragment2 = {
            "id": "6789",
            "ownerId": "aamfahim",
            "created": "2023-10-03",
            "updated": "2023-10-03",
            "type": "text/plain",
            "size": 256
        }
        await db.writeFragment(fragment1);
        await db.writeFragment(fragment2);
        const result = await db.listFragments(fragment1.ownerId);
        expect(result).toContain(fragment1.id, fragment2.id);

    });

    test('listFragments() returns full fragments when expand is true', async () => {

        const fragment = {
            id: '12345',
            ownerId: 'aamfahim',
            created: '2023-10-03',
            updated: '2023-10-03',
            type: 'text/plain',
            size: 256
        };

        await db.writeFragment(fragment);
        const result = await db.listFragments(fragment.ownerId, true);

        expect(result).toEqual([fragment]);
    });

    test('listFragments() returns empty array when no fragments are found', async () => {

        const result = await db.listFragments('jack');
        expect(result).toEqual([]);
    });

    test('deleteFragment() should remove fragment', async () => {
        const fragment = {
            id: '12345',
            ownerId: 'aamfahim',
            created: '2023-10-03',
            updated: '2023-10-03',
            type: 'text/plain',
            size: 256
        };

        await db.writeFragment(fragment)
        let result = await db.readFragment(fragment.ownerId, fragment.id)
        
        await db.writeFragmentData(fragment.ownerId, fragment.id, fragment)
        result = await db.readFragmentData(fragment.ownerId, fragment.id)
        expect(result).toBe(fragment);
        
        await db.deleteFragment(fragment.ownerId, fragment.id);
    })
})