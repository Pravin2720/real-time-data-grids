from marshmallow import Schema, fields


class CellUpdateSchema(Schema):
    type = fields.Str()
    rowIndex = fields.Int()
    colIndex = fields.Str()
    value = fields.Str()


class InitialDataSchema(Schema):
    type = fields.Str()
    data = fields.List(fields.Dict())
