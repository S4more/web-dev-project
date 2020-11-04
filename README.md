# web-dev-project

# Server
The server is preferably run on port 5555 and there is no current validation for the type of data that ir receives.
It is important to send the right data

## Post params

  | Variables  | Type |
  | ------------- | ------------- |
  | `id` | integer | 
  | `board`  | integer |
  | `square`  | string `a-h` `1-8`|
  | `piece` | string |

## Get parms

  | Variable  | Type |
  | ------------- | ------------- |
  | `status`  | string - ok / wrongTurn / fullBoard / missingOpponent |
  | `square`  | strinh `a-h` `1-8` |
  | `piece`   | string |
  
