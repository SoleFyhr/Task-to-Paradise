from enum import Enum


class TaskType(Enum):
    DAILY = "daily"
    ONCE = "once"
    HABITS = "habits"
    PROHIBITED = "prohibited"

    @staticmethod
    def from_string(label):
        for name, member in TaskType.__members__.items():
            if member.value == label:
                return member
        raise ValueError(f'{label} is not a valid TaskType')
    


class TimeEnum(Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"

    @staticmethod
    def from_string(label):
        for name, member in TimeEnum.__members__.items():
            if member.value == label:
                return member
        raise ValueError(f'{label} is not a valid TimeType')

class Active(Enum):
    ACTIVE = "active"


class Scaling_Cat(Enum):
    DIFFICULTY = "difficulty"
    COMPLETION = "completion"
    IMPORTANCE = "importance"

    @staticmethod
    def from_string(label):
        for name, member in Scaling_Cat.__members__.items():
            if member.value == label:
                return member
        raise ValueError(f'{label} is not a valid Scaling Cat')
    

    @staticmethod
    def number_of_inputs(category):
        values = [4,5,3]
        return values[list(Scaling_Cat).index(category)]



class Completion(Enum):
    MOTION = "went through the motion"
    FORGOT = "forgot to put the task"
    AVERAGE = "average" 
    GOOD = "good"
    PERFECT = "perfect"

    @staticmethod
    def from_string(label):
        for name, member in Completion.__members__.items():
            if member.value == label:
                return member
        raise ValueError(f'{label} is not a valid Completion')
    
    @staticmethod
    def value_completion(completion,values):
        #values = [0.25,0.5,0.8,1,1.5]
        return values[list(Completion).index(completion)]

# values = [0.25,0.5,0.8,1,1.5]
# print(Completion.value_completion(Completion.AVERAGE,values))


class Difficulty(Enum):
    VEASY = "very_easy"
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

    @staticmethod
    def from_string(label):
        for name, member in Difficulty.__members__.items():
            if member.value == label:
                return member
        raise ValueError(f'{label} is not a valid Difficulty')


class Importance(Enum):
    NSIMPORTANT= "not so important"
    IMPORTANT = "important"
    SUPRAIMPORTANT = "very important"

    @staticmethod
    def from_string(label):
        for name, member in Importance.__members__.items():
            if member.value == label:
                return member
        raise ValueError(f'{label} is not a valid Importance')
    
    @staticmethod
    def value_importance(importance,values):
        #values = [0.25,0.5,0.8,1,1.5]
        return values[list(Importance).index(importance)]
    
#Importance.value_importance(Importance.from_string("important"),values)
