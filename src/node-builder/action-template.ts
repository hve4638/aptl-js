import { FragmentType } from "@/types";
import { EvaluatableExpression } from "../expr-parse";
import { CBFNode, NodeType, ActionType } from "../types/node";

export const ActionTemplate = {
    enterScope():CBFNode {
        return {
            node_type: NodeType.ACTION,
            type: ActionType.ENTER_SCOPE,
        };
    },
    exitScope():CBFNode {
        return {
            node_type: NodeType.ACTION,
            type: ActionType.EXIT_SCOPE,
        };
    },
    jump(jumpTo:number):CBFNode {
        return {
            node_type: NodeType.ACTION,
            type: ActionType.JUMP,
            jump_to: jumpTo,
        };
    },
    break():CBFNode {
        return {
            node_type: NodeType.ACTION,
            type: ActionType.BREAK,
        };
    },
    jumpConditional(expression:EvaluatableExpression, jumpTo:number):CBFNode {
        return {
            node_type: NodeType.ACTION,
            type: ActionType.CONDITIONAL_JUMP,
            fragment: {
                type : FragmentType.TEXT,
                position : expression.position,
                size : expression.size,
                full_text : expression.value,
            },
            expression: expression,
            not: false,
            jump_to: jumpTo,
        };
    },
    iterateInit(expression:EvaluatableExpression, iterator_variable:string):CBFNode {
        return {
            node_type: NodeType.ACTION,
            type: ActionType.ITERATE_INIT,
            fragment: {
                type : FragmentType.TEXT,
                position : expression.position,
                size : expression.size,
                full_text : expression.value,
            },
            expression: expression,
            iterator_variable: iterator_variable,
        };
    },
    iterateNext(iterate_variable:string, result_variable:string):CBFNode {
        return {
            node_type: NodeType.ACTION,
            type: ActionType.ITERATE_NEXT,
            iterator_variable : iterate_variable,
            result_variable : result_variable,
        };
    },
    jumpIfIterateDone(iterator_variable:string, jumpTo:number):CBFNode {
        return {
            node_type: NodeType.ACTION,
            type: ActionType.JUMP_IF_ITERATE_DONE,
            iterator_variable: iterator_variable,
            jump_to: jumpTo,
        };
    }
} as const;
