# [
#   {
#     "clearOnHide":false,
#     "key":"panel",
#     "input":false,
#     "title":"",
#     "theme":"default",
#     "tableView":false,
#     "components":
#       [
#         {
#           "active":true,
#           "persistent":true,
#           "key":"panelTextField",
#           "label":"Text Field",
#           "type":"textfield",
#           "$$hashKey":"object:542",
#           "tags":[],
#           "lockKey":true,
#           "creator":"local-user",
#           "created":"2020-05-13T20:09:47.831Z",
#           "modifier":"local-user",
#           "modified":"2020-05-13T20:09:47.831Z"
#         }
#       ],
#     "type":"panel",
#     "breadcrumb":"default",
#     "modalType":"modal",
#     "$$hashKey":"object:316",
#     "frozen":false,
#     "staleImport":false,
#     "tags":[],
#     "form":"5b16c26e6710b700199f45eb",
#     "lockKey":true,
#     "label":"",
#     "creator":"local-user",
#     "created":"2020-05-13T20:09:42.921Z",
#     "modifier":"local-user",
#     "modified":"2020-05-13T20:09:42.921Z"
#   }
# ]


class Component:
    def __init__(self, key = "A", children = []):
        self.key = key
        self.components = children


A = Component('A', [])
B = Component('B', [A])
C = Component('C', [A, B])


class Solution:
    def findAncestor(self, targetComponent, allComponent):
        # 空字典记录所有component的入度
        dic = {}
        # 遍历所有的component，计算它们的入度
        for component in allComponent:
            for child in component.components:
                if child not in dic:
                    dic[child] = 1
                else:
                    dic[child] += 1
        
        import collections
        # 空字典记录所有的component的关系，防止重复，默认值是set()
        relationship = collections.defaultdict(set)
        # 用一个列队辅助
        queue = collections.deque([])

        # 如果一个component不在dic种，说明入度为0，就是根
        for component in allComponent:
          if component not in dic:
              queue.append(component)

        # BFS 算法
        while queue:
            node = queue.popleft()
            for child in node.components:
                dic[child] -= 1
                relationship[child].add(node)
                if dic[child] == 0:
                    queue.append(child)

        # 记录结果，防止重复用set()
        ans = set()
        queue = collections.deque([])
        for ancestor in relationship[targetComponent]:
            if ancestor.key not in ans:
                queue.append(ancestor)
        
        # 再用queue做一遍BFS，遍历关系字典，把所有祖先节点的祖先也遍历进去
        while queue:
            node = queue.popleft()
            ans.add(node.key)
            for ancestor in relationship[node]:
                if ancestor.key not in ans:
                  queue.append(ancestor)
        return ans



if __name__ == "__main__":
  
    A = Component('A', [])
    B = Component('B', [A])
    C = Component('C', [A, B])
    D = Component('D', [A])
    E = Component('E', [B])
    F = Component('F', [])
    
    solution = Solution()
    res = solution.findAncestor(A, [A, B, C, D, E, F])
    print(res)