import yaml
import json


def getSchema(type,name):
    shema = {
        'schema' : {
        }
    }
    if type == 'object':
        shema['schema']['$ref'] = '#/components/schemas/' + name.capitalize()
    else:
        shema['schema']['type'] = type
        if type == 'array':
            shema['schema']['items'] = {}
            shema['schema']['items']['$ref'] = '#/components/schemas/' + name.capitalize()
    return shema

def getParameters(parameters):
  if parameters == []:
    return []
  [nameId, path,required,typeI] = parameters
  param = []
  para = [{
    'name': nameId,
    'in' : path,
    'required': bool(required),
    'schema': {
    'type': typeI
              }
  }]
  return para

def getResponse(typeFunc,type,name):
    response = {}
    if typeFunc == 'get':
        response =  {
                        '200': {
                            'description': 'successful operation',
                            'content': {
                                'application/json': getSchema(type,name)
                            }
                        },
                        '400' : {
                            'description': 'Invalid'
                        },
                        '404': {
                            'description': name + ' not found'
                        }
                    }
    elif typeFunc == 'delete':
        response = {
            '400': {
                'description': 'Invalid '+ name +'Id supplied'
            },
            '404': {
                'description': name + 'Id not found'
            }
        }
    elif typeFunc == 'put':
      response = {
        'default':{
          'description': 'successful operation'
        }   
      }
    else:
      response = {
        'default':{
          'description': 'successful operation',
          'content':{
            'application/json': getSchema(type,name)
          }
        } 
      }

        
    
    return response

    

def function(typeF,name, funcName,summary,typeI,parameters):
    d = {
            'tags': [name], 
            'summary': summary,
            'operationId': funcName,
            'parameters': getParameters(parameters),
            'responses': getResponse(typeF,typeI,name)  
        }
    if typeF == 'put' or typeF == 'post':
        d['requestBody'] = {
            'description': 'Update an existent file',
            'content': {
              'application/json': getSchema(typeI,name)
            }
        }
    return d

def multiF(requests,name, funcNames,summarys,typeI,parameters):
  res = {}
  for request, funcName,summary in zip(requests,funcNames, summarys):
    res[request] = function(request,name, funcName,summary,typeI,parameters)

  return res

def converttoJaml():
  d = {}
  f = open('apiInfo.json')
  data = json.load(f)
  for path in data:
    d[path] = multiF(data[path]['requestTypes'],
                     data[path]['name'],
                     data[path]['requestTypeFunctionName'],
                     data[path]['requestTypesSummary'],
                     data[path]['responseType'],
                     data[path]['parameters'])
  with open('result.yml', 'w') as yaml_file:
      yaml.dump(d, yaml_file, default_flow_style=False)

converttoJaml()

"""
 d['/files/{fileId}'] = multiF( 
    ['get','put','delete'], 
    'file',
    ['getFilesById','updateFileById','deleteFileById'] ,
    ['get files','update file','delete file'], 
    'object',
    ['fileId','path','true','integer'])
    d['/file'] = multiF( 
    ['post'], 
    'file',
    ['postFiles'] ,
    ['make new file'], 
    'object',
    []
    )
    d['/files'] = multiF(
    ['get'], 
    'file',
    ['getFiles'] ,
    ['get all files'], 
    'array',
    [])"""

"""
d = {'A':'a', 'B':{'C':'c', 'D':'d', 'E':'e'}}
with open('result.yml', 'w') as yaml_file:
    yaml.dump(d, yaml_file, default_flow_style=False)"""

"""
/files:
    get:
      tags:
        - file
      summary: Get files
      operationId: getFiles
      responses:
        '200':
          description: successful operation
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/File'          
        '400':
          description: Invalid
  /file:
    post:
      tags:
        - file
      summary: Create File
      operationId: createFile
      requestBody:
        description: Created file object
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/File'
      responses:
        default:
          description: successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/File'
  /file/{fileId}:
    get:
      tags:
        - file
      summary: Get user by  FileId
      operationId: getFileById
      parameters:
        - name: fileId
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/File'          
        '400':
          description: Invalid fileId supplied
        '404':
          description: fileId not found
    put:
      tags:
        - file
      summary: Update file
      operationId: updateFile
      parameters:
        - name: fileId
          in: path
          required: true
          schema:
            type: integer
      requestBody:
        description: Update an existent file
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/File'
      responses:
        default:
          description: successful operation
    delete:
      tags:
        - file
      summary: Delete file
      operationId: deleteFile
      parameters:
        - name: fileId
          in: path
          required: true
          schema:
            type: integer
      responses:
        '400':
          description: Invalid fileId supplied
        '404':
          description: fileId not found
"""