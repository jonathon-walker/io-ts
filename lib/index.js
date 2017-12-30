"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Either_1 = require("fp-ts/lib/Either");
/**
 * Laws:
 * 1. validate(x).fold(() => x, serialize) = x
 * 2. validate(serialize(x)) = Right(x)
 */
var Type = /** @class */ (function () {
    function Type(name, is, validate, serialize) {
        this.name = name;
        this.is = is;
        this.validate = validate;
        this.serialize = serialize;
    }
    Type.prototype.pipe = function (ab, name) {
        var _this = this;
        return new Type(name || "pipe(" + this.name + ", " + ab.name + ")", ab.is, function (s, c) { return _this.validate(s, c).chain(function (a) { return ab.validate(a, c); }); }, this.serialize === exports.identity && ab.serialize === exports.identity
            ? exports.identity
            : function (b) { return _this.serialize(ab.serialize(b)); });
    };
    Type.prototype.asDecoder = function () {
        return this;
    };
    Type.prototype.asEncoder = function () {
        return this;
    };
    return Type;
}());
exports.Type = Type;
exports.identity = function (a) { return a; };
exports.getFunctionName = function (f) {
    return f.displayName || f.name || "<function" + f.length + ">";
};
exports.getContextEntry = function (key, type) { return ({ key: key, type: type }); };
exports.getValidationError = function (value, context) { return ({ value: value, context: context }); };
exports.getDefaultContext = function (type) { return [{ key: '', type: type }]; };
exports.appendContext = function (c, key, type) {
    var len = c.length;
    var r = Array(len + 1);
    for (var i = 0; i < len; i++) {
        r[i] = c[i];
    }
    r[len] = { key: key, type: type };
    return r;
};
exports.failures = function (errors) { return new Either_1.Left(errors); };
exports.failure = function (value, context) {
    return exports.failures([exports.getValidationError(value, context)]);
};
exports.success = function (value) { return new Either_1.Right(value); };
exports.validate = function (value, type) {
    return type.validate(value, exports.getDefaultContext(type));
};
var pushAll = function (xs, ys) { return Array.prototype.push.apply(xs, ys); };
//
// basic types
//
var NullType = /** @class */ (function (_super) {
    __extends(NullType, _super);
    function NullType() {
        var _this = _super.call(this, 'null', function (v) { return v === null; }, function (s, c) { return (_this.is(s) ? exports.success(s) : exports.failure(s, c)); }, exports.identity) || this;
        _this._tag = 'NullType';
        return _this;
    }
    return NullType;
}(Type));
exports.NullType = NullType;
/** @alias `null` */
exports.nullType = new NullType();
exports.null = exports.nullType;
var UndefinedType = /** @class */ (function (_super) {
    __extends(UndefinedType, _super);
    function UndefinedType() {
        var _this = _super.call(this, 'undefined', function (v) { return v === void 0; }, function (s, c) { return (_this.is(s) ? exports.success(s) : exports.failure(s, c)); }, exports.identity) || this;
        _this._tag = 'UndefinedType';
        return _this;
    }
    return UndefinedType;
}(Type));
exports.UndefinedType = UndefinedType;
var undefinedType = new UndefinedType();
exports.undefined = undefinedType;
var AnyType = /** @class */ (function (_super) {
    __extends(AnyType, _super);
    function AnyType() {
        var _this = _super.call(this, 'any', function (_) { return true; }, exports.success, exports.identity) || this;
        _this._tag = 'AnyType';
        return _this;
    }
    return AnyType;
}(Type));
exports.AnyType = AnyType;
exports.any = new AnyType();
var NeverType = /** @class */ (function (_super) {
    __extends(NeverType, _super);
    function NeverType() {
        var _this = _super.call(this, 'never', function (_) { return false; }, function (s, c) { return exports.failure(s, c); }, function () {
            throw new Error('cannot serialize never');
        }) || this;
        _this._tag = 'NeverType';
        return _this;
    }
    return NeverType;
}(Type));
exports.NeverType = NeverType;
exports.never = new NeverType();
var StringType = /** @class */ (function (_super) {
    __extends(StringType, _super);
    function StringType() {
        var _this = _super.call(this, 'string', function (v) { return typeof v === 'string'; }, function (s, c) { return (_this.is(s) ? exports.success(s) : exports.failure(s, c)); }, exports.identity) || this;
        _this._tag = 'StringType';
        return _this;
    }
    return StringType;
}(Type));
exports.StringType = StringType;
exports.string = new StringType();
var NumberType = /** @class */ (function (_super) {
    __extends(NumberType, _super);
    function NumberType() {
        var _this = _super.call(this, 'number', function (v) { return typeof v === 'number'; }, function (s, c) { return (_this.is(s) ? exports.success(s) : exports.failure(s, c)); }, exports.identity) || this;
        _this._tag = 'NumberType';
        return _this;
    }
    return NumberType;
}(Type));
exports.NumberType = NumberType;
exports.number = new NumberType();
var BooleanType = /** @class */ (function (_super) {
    __extends(BooleanType, _super);
    function BooleanType() {
        var _this = _super.call(this, 'boolean', function (v) { return typeof v === 'boolean'; }, function (s, c) { return (_this.is(s) ? exports.success(s) : exports.failure(s, c)); }, exports.identity) || this;
        _this._tag = 'BooleanType';
        return _this;
    }
    return BooleanType;
}(Type));
exports.BooleanType = BooleanType;
exports.boolean = new BooleanType();
var AnyArrayType = /** @class */ (function (_super) {
    __extends(AnyArrayType, _super);
    function AnyArrayType() {
        var _this = _super.call(this, 'Array', Array.isArray, function (s, c) { return (_this.is(s) ? exports.success(s) : exports.failure(s, c)); }, exports.identity) || this;
        _this._tag = 'AnyArrayType';
        return _this;
    }
    return AnyArrayType;
}(Type));
exports.AnyArrayType = AnyArrayType;
var arrayType = new AnyArrayType();
exports.Array = arrayType;
var AnyDictionaryType = /** @class */ (function (_super) {
    __extends(AnyDictionaryType, _super);
    function AnyDictionaryType() {
        var _this = _super.call(this, 'Dictionary', function (v) { return v !== null && typeof v === 'object'; }, function (s, c) { return (_this.is(s) ? exports.success(s) : exports.failure(s, c)); }, exports.identity) || this;
        _this._tag = 'AnyDictionaryType';
        return _this;
    }
    return AnyDictionaryType;
}(Type));
exports.AnyDictionaryType = AnyDictionaryType;
exports.Dictionary = new AnyDictionaryType();
var ObjectType = /** @class */ (function (_super) {
    __extends(ObjectType, _super);
    function ObjectType() {
        var _this = _super.call(this, 'object', exports.Dictionary.is, exports.Dictionary.validate, exports.identity) || this;
        _this._tag = 'ObjectType';
        return _this;
    }
    return ObjectType;
}(Type));
exports.ObjectType = ObjectType;
exports.object = new ObjectType();
var FunctionType = /** @class */ (function (_super) {
    __extends(FunctionType, _super);
    function FunctionType() {
        var _this = _super.call(this, 'Function', function (v) { return typeof v === 'function'; }, function (s, c) { return (_this.is(s) ? exports.success(s) : exports.failure(s, c)); }, exports.identity) || this;
        _this._tag = 'FunctionType';
        return _this;
    }
    return FunctionType;
}(Type));
exports.FunctionType = FunctionType;
exports.Function = new FunctionType();
//
// refinements
//
var RefinementType = /** @class */ (function (_super) {
    __extends(RefinementType, _super);
    function RefinementType(name, is, validate, serialize, type, predicate) {
        var _this = _super.call(this, name, is, validate, serialize) || this;
        _this.type = type;
        _this.predicate = predicate;
        _this._tag = 'RefinementType';
        return _this;
    }
    return RefinementType;
}(Type));
exports.RefinementType = RefinementType;
exports.refinement = function (type, predicate, name) {
    if (name === void 0) { name = "(" + type.name + " | " + exports.getFunctionName(predicate) + ")"; }
    return new RefinementType(name, function (v) { return type.is(v) && predicate(v); }, function (s, c) { return type.validate(s, c).chain(function (a) { return (predicate(a) ? exports.success(a) : exports.failure(a, c)); }); }, type.serialize, type, predicate);
};
exports.Integer = exports.refinement(exports.number, function (n) { return n % 1 === 0; }, 'Integer');
//
// literals
//
var LiteralType = /** @class */ (function (_super) {
    __extends(LiteralType, _super);
    function LiteralType(name, is, validate, serialize, value) {
        var _this = _super.call(this, name, is, validate, serialize) || this;
        _this.value = value;
        _this._tag = 'LiteralType';
        return _this;
    }
    return LiteralType;
}(Type));
exports.LiteralType = LiteralType;
exports.literal = function (value, name) {
    if (name === void 0) { name = JSON.stringify(value); }
    var is = function (v) { return v === value; };
    return new LiteralType(name, is, function (s, c) { return (is(s) ? exports.success(value) : exports.failure(s, c)); }, exports.identity, value);
};
//
// keyof
//
var KeyofType = /** @class */ (function (_super) {
    __extends(KeyofType, _super);
    function KeyofType(name, is, validate, serialize, keys) {
        var _this = _super.call(this, name, is, validate, serialize) || this;
        _this.keys = keys;
        _this._tag = 'KeyofType';
        return _this;
    }
    return KeyofType;
}(Type));
exports.KeyofType = KeyofType;
exports.keyof = function (keys, name) {
    if (name === void 0) { name = "(keyof " + JSON.stringify(Object.keys(keys)) + ")"; }
    var is = function (v) { return exports.string.is(v) && keys.hasOwnProperty(v); };
    return new KeyofType(name, is, function (s, c) { return (is(s) ? exports.success(s) : exports.failure(s, c)); }, exports.identity, keys);
};
//
// recursive types
//
var RecursiveType = /** @class */ (function (_super) {
    __extends(RecursiveType, _super);
    function RecursiveType(name, is, validate, serialize) {
        var _this = _super.call(this, name, is, validate, serialize) || this;
        _this._tag = 'RecursiveType';
        return _this;
    }
    return RecursiveType;
}(Type));
exports.RecursiveType = RecursiveType;
exports.recursion = function (name, definition) {
    var Self = new RecursiveType(name, function (v) { return type.is(v); }, function (s, c) { return type.validate(s, c); }, exports.identity);
    var type = definition(Self);
    Self.type = type;
    Self.serialize = type.serialize;
    return Self;
};
//
// arrays
//
var ArrayType = /** @class */ (function (_super) {
    __extends(ArrayType, _super);
    function ArrayType(name, is, validate, serialize, type) {
        var _this = _super.call(this, name, is, validate, serialize) || this;
        _this.type = type;
        _this._tag = 'ArrayType';
        return _this;
    }
    return ArrayType;
}(Type));
exports.ArrayType = ArrayType;
exports.array = function (type, name) {
    if (name === void 0) { name = "Array<" + type.name + ">"; }
    return new ArrayType(name, function (v) { return arrayType.is(v) && v.every(type.is); }, function (s, c) {
        return arrayType.validate(s, c).chain(function (xs) {
            var len = xs.length;
            var a = xs;
            var errors = [];
            var _loop_1 = function (i) {
                var x = xs[i];
                var validation = type.validate(x, exports.appendContext(c, String(i), type));
                validation.fold(function (e) { return pushAll(errors, e); }, function (vx) {
                    if (vx !== x) {
                        if (a === xs) {
                            a = xs.slice();
                        }
                        a[i] = vx;
                    }
                });
            };
            for (var i = 0; i < len; i++) {
                _loop_1(i);
            }
            return errors.length ? exports.failures(errors) : exports.success(a);
        });
    }, type.serialize === exports.identity ? exports.identity : function (a) { return a.map(type.serialize); }, type);
};
var InterfaceType = /** @class */ (function (_super) {
    __extends(InterfaceType, _super);
    function InterfaceType(name, is, validate, serialize, props) {
        var _this = _super.call(this, name, is, validate, serialize) || this;
        _this.props = props;
        _this._tag = 'InterfaceType';
        return _this;
    }
    return InterfaceType;
}(Type));
exports.InterfaceType = InterfaceType;
var getNameFromProps = function (props) {
    return "{ " + Object.keys(props)
        .map(function (k) { return k + ": " + props[k].name; })
        .join(', ') + " }";
};
var useIdentity = function (props) {
    for (var k in props) {
        if (props[k].serialize !== exports.identity) {
            return false;
        }
    }
    return true;
};
/** @alias `interface` */
exports.type = function (props, name) {
    if (name === void 0) { name = getNameFromProps(props); }
    return new InterfaceType(name, function (v) {
        if (!exports.Dictionary.is(v)) {
            return false;
        }
        for (var k in props) {
            if (!props[k].is(v[k])) {
                return false;
            }
        }
        return true;
    }, function (s, c) {
        return exports.Dictionary.validate(s, c).chain(function (o) {
            var a = o;
            var errors = [];
            var _loop_2 = function (k) {
                var ok = o[k];
                var type_1 = props[k];
                var validation = type_1.validate(ok, exports.appendContext(c, k, type_1));
                validation.fold(function (e) { return pushAll(errors, e); }, function (vok) {
                    if (vok !== ok) {
                        if (a === o) {
                            a = __assign({}, o);
                        }
                        a[k] = vok;
                    }
                });
            };
            for (var k in props) {
                _loop_2(k);
            }
            return errors.length ? exports.failures(errors) : exports.success(a);
        });
    }, useIdentity(props)
        ? exports.identity
        : function (a) {
            var s = __assign({}, a);
            for (var k in props) {
                s[k] = props[k].serialize(a[k]);
            }
            return s;
        }, props);
};
exports.interface = exports.type;
var PartialType = /** @class */ (function (_super) {
    __extends(PartialType, _super);
    function PartialType(name, is, validate, serialize, props) {
        var _this = _super.call(this, name, is, validate, serialize) || this;
        _this.props = props;
        _this._tag = 'PartialType';
        return _this;
    }
    return PartialType;
}(Type));
exports.PartialType = PartialType;
exports.partial = function (props, name) {
    if (name === void 0) { name = "PartialType<" + getNameFromProps(props) + ">"; }
    var partials = {};
    for (var k in props) {
        partials[k] = exports.union([props[k], undefinedType]);
    }
    var partial = exports.type(partials);
    return new PartialType(name, partial.is, partial.validate, useIdentity(props)
        ? exports.identity
        : function (a) {
            var s = {};
            for (var k in props) {
                var ak = a[k];
                if (ak !== undefined) {
                    s[k] = props[k].serialize(ak);
                }
            }
            return s;
        }, props);
};
//
// dictionaries
//
var DictionaryType = /** @class */ (function (_super) {
    __extends(DictionaryType, _super);
    function DictionaryType(name, is, validate, serialize, domain, codomain) {
        var _this = _super.call(this, name, is, validate, serialize) || this;
        _this.domain = domain;
        _this.codomain = codomain;
        _this._tag = 'DictionaryType';
        return _this;
    }
    return DictionaryType;
}(Type));
exports.DictionaryType = DictionaryType;
exports.dictionary = function (domain, codomain, name) {
    if (name === void 0) { name = "{ [K in " + domain.name + "]: " + codomain.name + " }"; }
    return new DictionaryType(name, function (v) {
        return exports.Dictionary.is(v) && Object.keys(v).every(function (k) { return domain.is(k) && codomain.is(v[k]); });
    }, function (s, c) {
        return exports.Dictionary.validate(s, c).chain(function (o) {
            var a = {};
            var errors = [];
            var changed = false;
            var _loop_3 = function (k) {
                var ok = o[k];
                var domainValidation = domain.validate(k, exports.appendContext(c, k, domain));
                var codomainValidation = codomain.validate(ok, exports.appendContext(c, k, codomain));
                domainValidation.fold(function (e) { return pushAll(errors, e); }, function (vk) {
                    changed = changed || vk !== k;
                    k = vk;
                });
                codomainValidation.fold(function (e) { return pushAll(errors, e); }, function (vok) {
                    changed = changed || vok !== ok;
                    a[k] = vok;
                });
            };
            for (var k in o) {
                _loop_3(k);
            }
            return errors.length ? exports.failures(errors) : exports.success((changed ? a : o));
        });
    }, domain.serialize === exports.identity && codomain.serialize === exports.identity
        ? exports.identity
        : function (a) {
            var s = {};
            for (var k in a) {
                s[String(domain.serialize(k))] = codomain.serialize(a[k]);
            }
            return s;
        }, domain, codomain);
};
//
// unions
//
var UnionType = /** @class */ (function (_super) {
    __extends(UnionType, _super);
    function UnionType(name, is, validate, serialize, types) {
        var _this = _super.call(this, name, is, validate, serialize) || this;
        _this.types = types;
        _this._tag = 'UnionType';
        return _this;
    }
    return UnionType;
}(Type));
exports.UnionType = UnionType;
exports.union = function (types, name) {
    if (name === void 0) { name = "(" + types.map(function (type) { return type.name; }).join(' | ') + ")"; }
    var len = types.length;
    return new UnionType(name, function (v) { return types.some(function (type) { return type.is(v); }); }, function (s, c) {
        var errors = [];
        for (var i = 0; i < len; i++) {
            var type_2 = types[i];
            var validation = type_2.validate(s, exports.appendContext(c, String(i), type_2));
            if (Either_1.isRight(validation)) {
                return validation;
            }
            else {
                pushAll(errors, validation.value);
            }
        }
        return exports.failures(errors);
    }, types.every(function (type) { return type.serialize === exports.identity; })
        ? exports.identity
        : function (a) {
            var i = 0;
            for (; i < len - 1; i++) {
                var type_3 = types[i];
                if (type_3.is(a)) {
                    return type_3.serialize(a);
                }
            }
            return types[i].serialize(a);
        }, types);
};
//
// intersections
//
var IntersectionType = /** @class */ (function (_super) {
    __extends(IntersectionType, _super);
    function IntersectionType(name, is, validate, serialize, types) {
        var _this = _super.call(this, name, is, validate, serialize) || this;
        _this.types = types;
        _this._tag = 'IntersectionType';
        return _this;
    }
    return IntersectionType;
}(Type));
exports.IntersectionType = IntersectionType;
function intersection(types, name) {
    if (name === void 0) { name = "(" + types.map(function (type) { return type.name; }).join(' & ') + ")"; }
    var len = types.length;
    return new IntersectionType(name, function (v) { return types.every(function (type) { return type.is(v); }); }, function (s, c) {
        var a = s;
        var errors = [];
        for (var i = 0; i < len; i++) {
            var type_4 = types[i];
            var validation = type_4.validate(a, c);
            validation.fold(function (e) { return pushAll(errors, e); }, function (va) { return (a = va); });
        }
        return errors.length ? exports.failures(errors) : exports.success(a);
    }, types.every(function (type) { return type.serialize === exports.identity; })
        ? exports.identity
        : function (a) {
            var s = a;
            for (var i = 0; i < len; i++) {
                var type_5 = types[i];
                s = type_5.serialize(s);
            }
            return s;
        }, types);
}
exports.intersection = intersection;
//
// tuples
//
var TupleType = /** @class */ (function (_super) {
    __extends(TupleType, _super);
    function TupleType(name, is, validate, serialize, types) {
        var _this = _super.call(this, name, is, validate, serialize) || this;
        _this.types = types;
        _this._tag = 'TupleType';
        return _this;
    }
    return TupleType;
}(Type));
exports.TupleType = TupleType;
function tuple(types, name) {
    if (name === void 0) { name = "[" + types.map(function (type) { return type.name; }).join(', ') + "]"; }
    var len = types.length;
    return new TupleType(name, function (v) { return arrayType.is(v) && v.length === len && types.every(function (type, i) { return type.is(v[i]); }); }, function (s, c) {
        return arrayType.validate(s, c).chain(function (as) {
            var t = as;
            var errors = [];
            var _loop_4 = function (i) {
                var a = as[i];
                var type_6 = types[i];
                var validation = type_6.validate(a, exports.appendContext(c, String(i), type_6));
                validation.fold(function (e) { return pushAll(errors, e); }, function (va) {
                    if (va !== a) {
                        if (t === as) {
                            t = as.slice();
                        }
                        t[i] = va;
                    }
                });
            };
            for (var i = 0; i < len; i++) {
                _loop_4(i);
            }
            if (as.length > len) {
                errors.push(exports.getValidationError(as[len], exports.appendContext(c, String(len), exports.never)));
            }
            return errors.length ? exports.failures(errors) : exports.success(t);
        });
    }, types.every(function (type) { return type.serialize === exports.identity; }) ? exports.identity : function (a) { return types.map(function (type, i) { return type.serialize(a[i]); }); }, types);
}
exports.tuple = tuple;
//
// readonly objects
//
var ReadonlyType = /** @class */ (function (_super) {
    __extends(ReadonlyType, _super);
    function ReadonlyType(name, is, validate, serialize, type) {
        var _this = _super.call(this, name, is, validate, serialize) || this;
        _this.type = type;
        _this._tag = 'ReadonlyType';
        return _this;
    }
    return ReadonlyType;
}(Type));
exports.ReadonlyType = ReadonlyType;
exports.readonly = function (type, name) {
    if (name === void 0) { name = "Readonly<" + type.name + ">"; }
    return new ReadonlyType(name, type.is, function (s, c) {
        return type.validate(s, c).map(function (x) {
            if (process.env.NODE_ENV !== 'production') {
                return Object.freeze(x);
            }
            return x;
        });
    }, type.serialize === exports.identity ? exports.identity : type.serialize, type);
};
//
// readonly arrays
//
var ReadonlyArrayType = /** @class */ (function (_super) {
    __extends(ReadonlyArrayType, _super);
    function ReadonlyArrayType(name, is, validate, serialize, type) {
        var _this = _super.call(this, name, is, validate, serialize) || this;
        _this.type = type;
        _this._tag = 'ReadonlyArrayType';
        return _this;
    }
    return ReadonlyArrayType;
}(Type));
exports.ReadonlyArrayType = ReadonlyArrayType;
exports.readonlyArray = function (type, name) {
    if (name === void 0) { name = "ReadonlyArray<" + type.name + ">"; }
    var arrayType = exports.array(type);
    return new ReadonlyArrayType(name, arrayType.is, function (s, c) {
        return arrayType.validate(s, c).map(function (x) {
            if (process.env.NODE_ENV !== 'production') {
                return Object.freeze(x);
            }
            else {
                return x;
            }
        });
    }, arrayType.serialize, type);
};
//
// strict interfaces
//
var StrictType = /** @class */ (function (_super) {
    __extends(StrictType, _super);
    function StrictType(name, is, validate, serialize, props) {
        var _this = _super.call(this, name, is, validate, serialize) || this;
        _this.props = props;
        _this._tag = 'StrictType';
        return _this;
    }
    return StrictType;
}(Type));
exports.StrictType = StrictType;
/** Specifies that only the given interface properties are allowed */
exports.strict = function (props, name) {
    if (name === void 0) { name = "StrictType<" + getNameFromProps(props) + ">"; }
    var loose = exports.type(props);
    return new StrictType(name, function (v) { return loose.is(v) && Object.getOwnPropertyNames(v).every(function (k) { return props.hasOwnProperty(k); }); }, function (s, c) {
        return loose.validate(s, c).chain(function (o) {
            var keys = Object.getOwnPropertyNames(o);
            var len = keys.length;
            var errors = [];
            for (var i = 0; i < len; i++) {
                var key = keys[i];
                if (!props.hasOwnProperty(key)) {
                    errors.push(exports.getValidationError(o[key], exports.appendContext(c, key, exports.never)));
                }
            }
            return errors.length ? exports.failures(errors) : exports.success(o);
        });
    }, loose.serialize, props);
};
//# sourceMappingURL=index.js.map