
const ObjectPrototype = Object.prototype;

const getPrototypeOf = Object.getPrototypeOf;

const toStringCat = Function.prototype.call.bind(ObjectPrototype.toString);

const cache = new WeakMap();

export function isPlainishObject(obj) {
    if (!obj || (typeof obj !== 'object')) {
        return false;
    }

    const cached = cache.get(obj);

    if (typeof cached === 'boolean') {
        return cached;
    }

    let result = false;

    try {
        if (toStringCat(obj) !== '[object Object]') {
            return result;
        }

        const directProto = getPrototypeOf(obj);

        if (typeof directProto !== 'object') {
            return result;
        }

        if ((directProto === null) || (directProto === ObjectPrototype)) {
            result = true;

            return result;
        }

        const Ctor = obj.constructor;

        if ((typeof Ctor !== 'function') || (Ctor !== directProto.constructor)) {
            return result;
        }

        const topProto = getPrototypeOf(directProto);

        if ((topProto !== null) && (topProto !== ObjectPrototype)) {
            return result;
        }

        const protoProps = Reflect.ownKeys(directProto);

        result = (protoProps.length === 1) && (protoProps[0] === 'constructor');

        return result;
    } finally {
        cache.set(obj, result);
    }

    // eslint-disable-next-line no-unreachable
    return false;
}
